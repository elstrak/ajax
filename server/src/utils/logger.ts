import fs from 'fs';
import path from 'path';

// Log levels
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

class Logger {
  private logDir: string;
  private logFile: string;
  
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  private write(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` - ${JSON.stringify(meta)}` : '';
    const logEntry = `[${timestamp}] [${level}] ${message}${metaString}\n`;
    
    // Log to console
    console.log(logEntry);
    
    // Log to file
    fs.appendFileSync(this.logFile, logEntry);
  }
  
  debug(message: string, meta?: any) {
    this.write(LogLevel.DEBUG, message, meta);
  }
  
  info(message: string, meta?: any) {
    this.write(LogLevel.INFO, message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.write(LogLevel.WARN, message, meta);
  }
  
  error(message: string, meta?: any) {
    this.write(LogLevel.ERROR, message, meta);
  }
  
  request(req: any, res: any) {
    const { method, url, ip } = req;
    const { statusCode } = res;
    
    this.info(`${method} ${url} ${statusCode}`, { ip });
  }
}

export default new Logger(); 