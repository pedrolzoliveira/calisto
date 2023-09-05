import winston from 'winston'

const { combine, timestamp, prettyPrint } = winston.format

const format = combine(timestamp(), prettyPrint())

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format }),
    new winston.transports.File({ format, filename: 'logs/combined.log', level: 'warn' })
  ]
})
