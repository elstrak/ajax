import { Request, Response } from 'express';
import Scan, { ScanStatus } from '../models/Scan';

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get total scans count
    const totalScans = await Scan.countDocuments({ userId });

    // Get total vulnerabilities count
    const scans = await Scan.find({ 
      userId, 
      status: ScanStatus.COMPLETED 
    });
    
    let totalVulnerabilities = 0;
    let securityScoreSum = 0;
    
    scans.forEach(scan => {
      totalVulnerabilities += scan.vulnerabilities.length;
      securityScoreSum += scan.securityScore;
    });
    
    // Calculate average security score
    const averageSecurityScore = scans.length > 0 
      ? Math.round(securityScoreSum / scans.length) 
      : 0;

    res.json({
      totalScans,
      totalVulnerabilities,
      averageSecurityScore
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentScans = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const recentScans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('sourceType fileName contractAddress network status securityScore createdAt completedAt');
    
    res.json({ recentScans });
  } catch (error) {
    console.error('Get recent scans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTopVulnerabilities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Get completed scans
    const scans = await Scan.find({ 
      userId, 
      status: ScanStatus.COMPLETED 
    });
    
    // Extract all vulnerabilities
    const allVulnerabilities: any[] = [];
    scans.forEach(scan => {
      scan.vulnerabilities.forEach(vuln => {
        allVulnerabilities.push({
          name: vuln.name,
          severity: vuln.severity,
          category: vuln.category,
          scanId: scan._id
        });
      });
    });
    
    // Group vulnerabilities by name
    const vulnerabilityCounts: Record<string, { count: number, severity: string, category: string }> = {};
    
    allVulnerabilities.forEach(vuln => {
      if (!vulnerabilityCounts[vuln.name]) {
        vulnerabilityCounts[vuln.name] = {
          count: 0,
          severity: vuln.severity,
          category: vuln.category
        };
      }
      vulnerabilityCounts[vuln.name].count += 1;
    });
    
    // Convert to array and sort by count
    const topVulnerabilities = Object.entries(vulnerabilityCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        severity: data.severity,
        category: data.category
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    res.json({ topVulnerabilities });
  } catch (error) {
    console.error('Get top vulnerabilities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 