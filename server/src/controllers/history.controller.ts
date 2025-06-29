import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Scan from '../models/Scan';
import { ScanStatus, ScanSourceType, BlockchainNetwork, VulnerabilitySeverity } from '../models/Scan';

export const getScanHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const totalScans = await Scan.countDocuments({ userId });
    
    // Get scans with pagination
    const scansRaw = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('sourceType fileName contractAddress status securityScore vulnerabilities createdAt completedAt');

    // Формируем структуру для фронта
    const scans = scansRaw.map(scan => {
      // Подсчет уязвимостей по уровням
      const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
      if (Array.isArray(scan.vulnerabilities)) {
        scan.vulnerabilities.forEach(v => {
          switch ((v.severity || '').toLowerCase()) {
            case 'critical': counts.critical++; break;
            case 'high': counts.high++; break;
            case 'medium': counts.medium++; break;
            case 'low': counts.low++; break;
            case 'info': counts.info++; break;
          }
        });
      }
      return {
        _id: scan._id,
        name: scan.fileName || scan.contractAddress || 'Без имени',
        createdAt: scan.createdAt,
        securityScore: scan.securityScore,
        vulnerabilities: counts,
        status: scan.status,
        completedAt: scan.completedAt,
      };
    });

    res.json({
      scans,
      pagination: {
        total: totalScans,
        page,
        limit,
        pages: Math.ceil(totalScans / limit)
      }
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getScanDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { scanId } = req.params;
    
    const scan = await Scan.findOne({ _id: scanId, userId });
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    function countVulnerabilities(vulnerabilities: any[]): { critical: number; high: number; medium: number; low: number } {
      const counts = { critical: 0, high: 0, medium: 0, low: 0 };
      (vulnerabilities || []).forEach((v: any) => {
        switch ((v.severity || '').toLowerCase()) {
          case 'critical': counts.critical++; break;
          case 'high': counts.high++; break;
          case 'medium': counts.medium++; break;
          case 'low': counts.low++; break;
        }
      });
      return counts;
    }

    res.json({
      scan: {
        id: scan._id,
        name: scan.fileName || scan.contractAddress || 'Без имени',
        address: scan.contractAddress || '',
        date: scan.createdAt,
        rating: Math.round((scan.securityScore || 0) / 10),
        vulnerabilities: countVulnerabilities(scan.vulnerabilities),
        vulnerabilityDetails: scan.vulnerabilities || [],
        network: scan.network,
        sourceContent: scan.sourceContent,
      }
    });
  } catch (error) {
    console.error('Get scan details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadScanReport = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { scanId } = req.params;
    
    const scan = await Scan.findOne({ _id: scanId, userId });
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Generate report data
    const reportData = {
      scanId: scan._id,
      createdAt: scan.createdAt,
      completedAt: scan.completedAt,
      sourceType: scan.sourceType,
      fileName: scan.fileName,
      contractAddress: scan.contractAddress,
      network: scan.network,
      securityScore: scan.securityScore,
      vulnerabilities: scan.vulnerabilities,
      blockchainAnalytics: scan.blockchainAnalytics
    };
    
    // In a real app, you'd generate a PDF or other formatted report
    // For now, we'll just return the JSON
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="report-${scanId}.json"`);
    res.json(reportData);
  } catch (error) {
    console.error('Download scan report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteScan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { scanId } = req.params;
    
    const scan = await Scan.findOne({ _id: scanId, userId });
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    await Scan.findByIdAndDelete(scanId);
    
    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHistoryStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Получаем все сканы пользователя
    const scans = await Scan.find({ userId, status: 'completed' });

    // Security trends (средний рейтинг по дням)
    const trendsMap: Record<string, { sum: number; count: number }> = {};
    scans.forEach(scan => {
      const day = scan.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!trendsMap[day]) trendsMap[day] = { sum: 0, count: 0 };
      trendsMap[day].sum += scan.securityScore;
      trendsMap[day].count++;
    });
    const securityTrends = Object.entries(trendsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, { sum, count }]) => ({ day, rating: count ? +(sum / count / 10).toFixed(1) : 0 }));

    // Vulnerability distribution (процент по типам уязвимостей)
    const vulnCount: Record<string, number> = {};
    let totalVulns = 0;
    scans.forEach(scan => {
      if (Array.isArray(scan.vulnerabilities)) {
        scan.vulnerabilities.forEach((v: any) => {
          vulnCount[v.name] = (vulnCount[v.name] || 0) + 1;
          totalVulns++;
        });
      }
    });
    const vulnerabilityDistribution = Object.entries(vulnCount).map(([name, count]) => ({
      name,
      percentage: totalVulns ? +(count * 100 / totalVulns).toFixed(1) : 0
    }));

    // Network activity (процент по сетям)
    const networkCount: Record<string, number> = {};
    let totalNetworks = 0;
    scans.forEach(scan => {
      if (scan.network) {
        networkCount[scan.network] = (networkCount[scan.network] || 0) + 1;
        totalNetworks++;
      }
    });
    const networkActivity = Object.entries(networkCount).map(([network, count]) => ({
      network,
      percentage: totalNetworks ? +(count * 100 / totalNetworks).toFixed(1) : 0
    }));

    // Recent incidents (заглушка)
    const recentIncidents = [
      {
        title: 'DAO Hack',
        date: '2016-06-17',
        description: 'Взлом The DAO, потеряно $60M',
        severity: 'critical',
        link: 'https://en.wikipedia.org/wiki/The_DAO_(organization)#Attack'
      }
    ];

    res.json({
      securityTrends,
      vulnerabilityDistribution,
      networkActivity,
      recentIncidents
    });
  } catch (error) {
    console.error('Get history stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addScan = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const {
      sourceType = ScanSourceType.CODE,
      sourceContent,
      fileName,
      contractAddress,
      network = BlockchainNetwork.ETHEREUM,
      securityScore,
      vulnerabilities = [],
      blockchainAnalytics,
      status = ScanStatus.COMPLETED,
    } = req.body;

    // Валидация минимальная, можно расширить
    if (!securityScore || !Array.isArray(vulnerabilities)) {
      return res.status(400).json({ message: 'Invalid scan data' });
    }

    const scan = new Scan({
      userId,
      sourceType,
      sourceContent,
      fileName,
      contractAddress,
      network,
      status,
      securityScore,
      vulnerabilities,
      blockchainAnalytics,
      createdAt: new Date(),
      completedAt: new Date(),
    });
    await scan.save();
    res.status(201).json({ scan });
  } catch (error) {
    console.error('Add scan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 