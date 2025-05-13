import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests per IP in the time window
}

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

export const createRateLimiter = (config: RateLimitConfig) => {
  const { windowMs, maxRequests } = config;
  const store: RateLimitStore = {};
  
  // Clean up store periodically
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (store[ip].resetTime <= now) {
        delete store[ip];
      }
    }
  }, windowMs);
  
  return (req: Request, res: Response, next: NextFunction) => {
    // Получаем IP как строку, а не массив строк
    const ipAddress = (
      typeof req.ip === 'string' ? req.ip : 
      typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'] :
      req.socket.remoteAddress || 'unknown'
    );
    
    const now = Date.now();
    
    // Initialize or reset counter if needed
    if (!store[ipAddress] || store[ipAddress].resetTime <= now) {
      store[ipAddress] = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    // Increment counter
    store[ipAddress].count += 1;
    
    // Set headers with rate limit info
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[ipAddress].count).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(store[ipAddress].resetTime / 1000).toString());
    
    // Check if limit exceeded
    if (store[ipAddress].count > maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }
    
    next();
  };
};

// Export common rate limiters
export const standardLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100
});

export const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10
});

export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5
}); 