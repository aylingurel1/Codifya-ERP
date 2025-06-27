// Merkezi logging sistemi
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  userId?: string
  requestId?: string
}

export type ILogger = {
  error(message: string, context?: Record<string, any>): void
  warn(message: string, context?: Record<string, any>): void
  info(message: string, context?: Record<string, any>): void
  debug(message: string, context?: Record<string, any>): void
}

export class Logger implements ILogger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const logEntry = this.formatLog(level, message, context)
    
    if (this.isDevelopment) {
      console.log(`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`, context || '')
    } else {
      // Production'da structured logging
      console.log(JSON.stringify(logEntry))
    }
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context)
    }
  }
}

export const logger = new Logger() 