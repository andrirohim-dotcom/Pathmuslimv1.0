/**
 * Simple logging utility for the application
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatEntry(entry: LogEntry): string {
    const { timestamp, level, message, data, error } = entry;
    let output = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      output += ` ${JSON.stringify(data, null, 2)}`;
    }

    if (error) {
      output += `\nError: ${error.message}`;
      if (error.stack && this.isDevelopment) {
        output += `\nStack: ${error.stack}`;
      }
    }

    return output;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    const formatted = this.formatEntry(entry);

    // Log to console based on level
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }

    // In production, you might send to external logging service (e.g., Sentry, LogRocket)
    // Example: if (!this.isDevelopment) { sendToExternalLogger(entry); }
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown) {
    const errorData: LogEntry['error'] = undefined;
    if (error instanceof Error) {
      (errorData as any) = {
        message: error.message,
        stack: error.stack,
      };
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: errorData,
      data,
    };

    const formatted = this.formatEntry(entry);
    console.error(formatted);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
