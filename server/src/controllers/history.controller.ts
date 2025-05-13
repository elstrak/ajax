import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Scan from '../models/Scan';

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
    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('sourceType fileName contractAddress network status securityScore vulnerabilities.length createdAt completedAt');
    
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
    
    res.json({ scan });
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