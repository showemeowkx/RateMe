import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const rotateTransport = new DailyRotateFile({
  filename: './src/payment/logs/transactions-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '14d',
  zippedArchive: true,
});

const logFormat = winston.format.printf(
  ({
    level,
    message,
    timestamp,
  }: {
    level: string;
    message: string;
    timestamp: string;
  }) => {
    return `${level.toUpperCase()} [${timestamp}]: ${message}`;
  },
);

export const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), logFormat),

  transports: [rotateTransport],
});
