import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.errors({
            stack: true
        }),
        winston.format.timestamp(),
        winston.format.json(),
    )

    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    new (winston.transports.Console)(),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.errors({
      stack: true
    })
  ),
});


