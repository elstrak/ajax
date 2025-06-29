import mongoose, { Document, Schema } from 'mongoose';

export enum ScanSourceType {
  CODE = 'code',
  FILE = 'file',
  CONTRACT_ADDRESS = 'contract_address'
}

export enum ScanStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism'
}

export enum VulnerabilitySeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export interface IVulnerability {
  name: string;
  description: string;
  severity: VulnerabilitySeverity;
  lineNumber?: number;
  code?: string;
  category: string;
  recommendation?: string;
}

export interface IBlockchainAnalytics {
  balance: string;
  transactions: {
    hash: string;
    timestamp: Date;
    from: string;
    to: string;
    value: string;
  }[];
  lastActivity?: Date;
}

export interface IScan extends Document {
  userId: mongoose.Types.ObjectId;
  sourceType: ScanSourceType;
  sourceContent?: string;
  fileName?: string;
  contractAddress?: string;
  network?: BlockchainNetwork;
  status: ScanStatus;
  securityScore: number;
  vulnerabilities: IVulnerability[];
  blockchainAnalytics?: IBlockchainAnalytics;
  createdAt: Date;
  completedAt?: Date;
}

const VulnerabilitySchema = new Schema<IVulnerability>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  severity: { 
    type: String, 
    enum: Object.values(VulnerabilitySeverity),
    required: true 
  },
  lineNumber: { type: Number },
  code: { type: String },
  category: { type: String, required: true },
  recommendation: { type: String }
});

const BlockchainTransactionSchema = new Schema({
  hash: { type: String, required: true },
  timestamp: { type: Date, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true }
});

const BlockchainAnalyticsSchema = new Schema({
  balance: { type: String, required: true },
  transactions: [BlockchainTransactionSchema],
  lastActivity: { type: Date }
});

const ScanSchema = new Schema<IScan>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sourceType: { 
    type: String, 
    enum: Object.values(ScanSourceType),
    required: true 
  },
  sourceContent: { type: String },
  fileName: { type: String },
  contractAddress: { type: String },
  network: { 
    type: String, 
    enum: Object.values(BlockchainNetwork) 
  },
  status: { 
    type: String, 
    enum: Object.values(ScanStatus),
    default: ScanStatus.PENDING,
    required: true 
  },
  securityScore: { 
    type: Number, 
    min: 0, 
    max: 100,
    default: 0
  },
  vulnerabilities: [VulnerabilitySchema],
  blockchainAnalytics: BlockchainAnalyticsSchema,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: { type: Date }
});

export default mongoose.model<IScan>('Scan', ScanSchema); 