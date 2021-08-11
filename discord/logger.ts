import * as winston from "winston";
import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/discord-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

winston.configure({ transports: [transport] });
