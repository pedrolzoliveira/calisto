import winston from 'winston';

const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

const consoleFormat = combine(
  colorize(),
  printf((data) => {
    if (typeof data.message === 'object') {
      data.message = JSON.stringify(data.message, null, 2);
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `[${data.level}]: ${data.message}`;
  })
);

const fileFormat = combine(timestamp(), prettyPrint());

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({ format: fileFormat, filename: 'logs/combined.log', level: 'warn' })
  ]
});
