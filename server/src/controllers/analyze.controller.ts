import { Request, Response } from 'express';
import Scan, { ScanSourceType, ScanStatus, BlockchainNetwork, VulnerabilitySeverity } from '../models/Scan';
import VulnerabilityKnowledge from '../models/Vulnerability';

// Async function to process code scan
const processCodeScan = async (scanId: string, code: string) => {
  try {
    // Update scan status to processing
    await Scan.findByIdAndUpdate(scanId, {
      status: ScanStatus.PROCESSING
    });

    // Analyze the smart contract code
    const result = await analyzeSmartContract(code);

    // Update scan with results
    await Scan.findByIdAndUpdate(scanId, {
      status: ScanStatus.COMPLETED,
      securityScore: result.securityScore,
      vulnerabilities: result.vulnerabilities,
      completedAt: new Date()
    });
  } catch (error) {
    console.error(`Error processing scan ${scanId}:`, error);
    
    // Update scan status to failed
    await Scan.findByIdAndUpdate(scanId, {
      status: ScanStatus.FAILED
    });
  }
};

// Service to analyze smart contract code
const analyzeSmartContract = async (code: string) => {
  // In a real application, this would call an ML model or external service
  // For now, we'll simulate results
  
  // Simulate processing time (1-3 seconds)
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock vulnerabilities
  const vulnerabilities = [
    {
      name: 'Reentrancy',
      description: 'Contract state is modified after external calls, allowing attackers to reenter the contract',
      severity: VulnerabilitySeverity.CRITICAL,
      lineNumber: 42,
      code: 'function withdraw() public {\\n  uint amount = balances[msg.sender];\\n  (bool success, ) = msg.sender.call{value: amount}("");\\n  require(success);\\n  balances[msg.sender] = 0;\\n}',
      category: 'Security'
    },
    {
      name: 'Unchecked External Call',
      description: 'Return value of external call is not checked',
      severity: VulnerabilitySeverity.HIGH,
      lineNumber: 105,
      code: 'msg.sender.transfer(amount);',
      category: 'Security'
    },
    {
      name: 'Integer Overflow',
      description: 'Arithmetic operation can overflow or underflow',
      severity: VulnerabilitySeverity.MEDIUM,
      lineNumber: 78,
      code: 'totalSupply += amount;',
      category: 'Arithmetic'
    }
  ];
  
  // Calculate security score (0-100)
  // In a real app, this would be based on vulnerability severity and frequency
  const securityScore = Math.floor(70 + Math.random() * 20);
  
  return {
    securityScore,
    vulnerabilities
  };
};

// Service to get blockchain data for a contract
const getBlockchainData = async (address: string, network: BlockchainNetwork) => {
  // In a real application, this would call a blockchain API
  // For now, we'll return mock data
  
  return {
    balance: '0.5 ETH',
    transactions: [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        from: '0xabcdef1234567890abcdef1234567890abcdef12',
        to: address,
        value: '0.1 ETH'
      },
      {
        hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        from: address,
        to: '0x12345678abcdef12345678abcdef12345678abcd',
        value: '0.05 ETH'
      }
    ],
    lastActivity: new Date(Date.now() - 86400000) // 1 day ago
  };
};

export const analyzeCode = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }
    
    // Create a new scan
    const scan = new Scan({
      userId,
      sourceType: ScanSourceType.CODE,
      sourceContent: code,
      status: ScanStatus.PENDING
    });
    
    await scan.save();
    
    // Process scan asynchronously
    // In a real app, this would be handled by a worker queue
    processCodeScan(scan._id.toString(), code);
    
    res.status(202).json({
      message: 'Code analysis started',
      scanId: scan._id
    });
  } catch (error) {
    console.error('Analyze code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const analyzeFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    
    const fileName = req.file.originalname;
    const fileContent = req.file.buffer.toString('utf-8');
    
    // Create a new scan
    const scan = new Scan({
      userId,
      sourceType: ScanSourceType.FILE,
      sourceContent: fileContent,
      fileName,
      status: ScanStatus.PENDING
    });
    
    await scan.save();
    
    // Process scan asynchronously
    processCodeScan(scan._id.toString(), fileContent);
    
    res.status(202).json({
      message: 'File analysis started',
      scanId: scan._id
    });
  } catch (error) {
    console.error('Analyze file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const analyzeContract = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { contractAddress, network } = req.body;
    
    if (!contractAddress) {
      return res.status(400).json({ message: 'Contract address is required' });
    }
    
    if (!network || !Object.values(BlockchainNetwork).includes(network as BlockchainNetwork)) {
      return res.status(400).json({ message: 'Valid network is required' });
    }
    
    // In a real app, we would fetch the contract code from the blockchain
    // For now, we'll just simulate it
    const mockContractCode = `
contract SimpleStorage {
    uint256 private _value;
    
    function store(uint256 value) public {
        _value = value;
    }
    
    function retrieve() public view returns (uint256) {
        return _value;
    }
}`;
    
    // Create a new scan
    const scan = new Scan({
      userId,
      sourceType: ScanSourceType.CONTRACT_ADDRESS,
      sourceContent: mockContractCode,
      contractAddress,
      network,
      status: ScanStatus.PENDING
    });
    
    await scan.save();
    
    // Process scan asynchronously
    processCodeScan(scan._id.toString(), mockContractCode);
    
    // Get blockchain data asynchronously
    getBlockchainDataForScan(scan._id.toString(), contractAddress, network as BlockchainNetwork);
    
    res.status(202).json({
      message: 'Contract analysis started',
      scanId: scan._id
    });
  } catch (error) {
    console.error('Analyze contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get and update blockchain data for a scan
const getBlockchainDataForScan = async (scanId: string, address: string, network: BlockchainNetwork) => {
  try {
    const blockchainData = await getBlockchainData(address, network);
    
    await Scan.findByIdAndUpdate(scanId, {
      blockchainAnalytics: blockchainData
    });
  } catch (error) {
    console.error(`Error getting blockchain data for scan ${scanId}:`, error);
  }
};

export const getAnalysisResults = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const scanId = req.params.scanId;
    
    const scan = await Scan.findOne({ _id: scanId, userId });
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    res.json({ scan });
  } catch (error) {
    console.error('Get analysis results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBlockchainAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { address } = req.params;
    const { network } = req.query;
    
    if (!address) {
      return res.status(400).json({ message: 'Contract address is required' });
    }
    
    if (!network || !Object.values(BlockchainNetwork).includes(network as BlockchainNetwork)) {
      return res.status(400).json({ message: 'Valid network is required' });
    }
    
    const blockchainData = await getBlockchainData(address, network as BlockchainNetwork);
    
    res.json({ blockchainData });
  } catch (error) {
    console.error('Get blockchain analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 