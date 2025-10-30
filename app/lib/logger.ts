const nodeColors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const browserColors = {
  red: "color: #E63946; font-weight: bold;",
  green: "color: #2A9D8F; font-weight: bold;",
  yellow: "color: #E9C46A; font-weight: bold;",
  blue: "color: #457B9D; font-weight: bold;",
  magenta: "color: #8338EC; font-weight: bold;",
  cyan: "color: #00B4D8; font-weight: bold;",
  dim: "color: #6c757d;",
};

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'WAIT';

const isBrowser = typeof window !== 'undefined';
const isProduction = process.env.NODE_ENV === 'production';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  public log(message: unknown, ...args: unknown[]) {
    this.print('INFO', message, ...args);
  }

  public info(message: unknown, ...args: unknown[]) {
    this.print('INFO', message, ...args);
  }

  public success(message: unknown, ...args: unknown[]) {
    this.print('SUCCESS', message, ...args);
  }

  public wait(message: unknown, ...args: unknown[]) {
    this.print('WAIT', message, ...args);
  }

  public warn(message: unknown, ...args: unknown[]) {
    this.print('WARN', message, ...args);
  }

  public error(message: unknown, ...args: unknown[]) {
    this.print('ERROR', message, ...args);
  }

  public debug(message: unknown, ...args: unknown[]) {
    if (isProduction) return;
    this.print('DEBUG', message, ...args);
  }

  private print(level: LogLevel, message: unknown, ...args: unknown[]) {
    const timestamp = new Date().toLocaleTimeString();
    const levelTag = `[${level}]`.padEnd(9, ' ');
    const contextTag = `[${this.context}]`;

    if (isBrowser) {
      this.printBrowser(level, levelTag, timestamp, contextTag, message, args);
    } else {
      this.printNode(level, levelTag, timestamp, contextTag, message, args);
    }
  }

  private printNode(level: LogLevel, levelTag: string, timestamp: string, contextTag: string, message: unknown, args: unknown[]) {
    const { reset, red, green, yellow, blue, magenta, cyan, dim } = nodeColors;
    
    let color = reset;
    if (level === 'SUCCESS') color = green;
    if (level === 'WAIT') color = blue;
    if (level === 'WARN') color = yellow;
    if (level === 'ERROR') color = red;
    if (level === 'DEBUG') color = magenta;

    console.log(
      `${color}${levelTag}${reset}`,
      `${dim}${timestamp}${reset}`,
      `${cyan}${contextTag}${reset}`,
      message,
      ...args.length ? args : ""
    );
  }

  private printBrowser(level: LogLevel, levelTag: string, timestamp: string, contextTag: string, message: unknown, args: unknown[]) {
    const { red, green, yellow, blue, magenta, cyan, dim } = browserColors;

    let levelColor = "";
    if (level === 'SUCCESS') levelColor = green;
    if (level === 'WAIT') levelColor = blue;
    if (level === 'WARN') levelColor = yellow;
    if (level === 'ERROR') levelColor = red;
    if (level === 'DEBUG') levelColor = magenta;

    console.log(
      `%c${levelTag}%c${timestamp} %c${contextTag}`,
      levelColor,
      dim,
      cyan,
      message,
      ...args
    );
  }
}

export default Logger;