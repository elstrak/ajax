import { Request, Response } from 'express';
import VulnerabilityKnowledge from '../models/Vulnerability';
import { VulnerabilitySeverity } from '../models/Scan';

export const getAllVulnerabilities = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get filter parameters
    const category = req.query.category as string;
    const severity = req.query.severity as VulnerabilitySeverity;
    
    // Build filter object
    const filter: Record<string, any> = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (severity && Object.values(VulnerabilitySeverity).includes(severity)) {
      filter.severity = severity;
    }
    
    // Get total count for pagination
    const totalVulnerabilities = await VulnerabilityKnowledge.countDocuments(filter);
    
    // Get vulnerabilities with pagination and filtering
    const vulnerabilities = await VulnerabilityKnowledge.find(filter)
      .sort({ severity: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .select('name description severity category');
    
    res.json({
      vulnerabilities,
      pagination: {
        total: totalVulnerabilities,
        page,
        limit,
        pages: Math.ceil(totalVulnerabilities / limit)
      }
    });
  } catch (error) {
    console.error('Get all vulnerabilities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVulnerabilityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const vulnerability = await VulnerabilityKnowledge.findById(id);
    
    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }
    
    res.json({ vulnerability });
  } catch (error) {
    console.error('Get vulnerability by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    // Get distinct categories
    const categories = await VulnerabilityKnowledge.distinct('category');
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVulnerabilitiesBySeverity = async (req: Request, res: Response) => {
  try {
    // Group vulnerabilities by severity
    const vulnerabilitiesBySeverity = await Promise.all(
      Object.values(VulnerabilitySeverity).map(async (severity) => {
        const vulnerabilities = await VulnerabilityKnowledge.find({ severity })
          .select('name description category')
          .sort({ name: 1 });
        
        return {
          severity,
          vulnerabilities
        };
      })
    );
    
    res.json({ vulnerabilitiesBySeverity });
  } catch (error) {
    console.error('Get vulnerabilities by severity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 