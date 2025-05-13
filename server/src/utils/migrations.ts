import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scan, { ScanStatus } from '../models/Scan';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcontract-analyzer')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Migration functions
const migrations = {
  // Example migration: Update all pending scans older than 24 hours to failed status
  async updateStuckScans() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const result = await Scan.updateMany({
      status: ScanStatus.PENDING,
      createdAt: { $lt: oneDayAgo }
    }, {
      status: ScanStatus.FAILED
    });
    
    console.log(`Updated ${result.modifiedCount} stuck scans to failed status`);
  },
  
  // Add more migrations as needed
};

// Run migrations
const runMigrations = async () => {
  try {
    console.log('Starting migrations...');
    
    // Run each migration
    for (const [name, migration] of Object.entries(migrations)) {
      console.log(`Running migration: ${name}`);
      await migration();
    }
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
  }
};

// Check if script is run directly
if (require.main === module) {
  runMigrations();
}

export default migrations; 