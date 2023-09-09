import { EventEmitter2 } from "eventemitter2";
import logger from "./logger";

export class Emitter {
  private messageEmitter;
  private requestEmitter;

  constructor() {
    const emitterOptions = {
      wildcard: true,
      verboseMemoryLeak: true,
      delimiter: ".",

      // This will ignore the "unspecified event" error
      ignoreErrors: true,
    };

    this.messageEmitter = new EventEmitter2(emitterOptions);
    this.requestEmitter = new EventEmitter2(emitterOptions);
  }

  public emitMessage(
    event: string | string[],
    meta: Record<string, any>
  ): void {
    const events = Array.isArray(event) ? event : [event];

    for (const event of events) {
      this.messageEmitter.emitAsync(event, meta).catch((err) => {
        logger.warn(`An error was thrown while executing action "${event}"`);
        logger.warn(err);
      });
    }
  }

  public async emitRequest(
    event: string,
    meta: Record<string, any>
  ): Promise<void> {
    try {
      await this.requestEmitter.emitAsync(event, { event, ...meta });
    } catch (err: any) {
      logger.warn(`An error was thrown while executing init "${event}"`);
      logger.warn(err);
    }
  }

  public onMessage(event: string, handler: () => void): void {
    this.messageEmitter.on(event, handler);
  }

  public offMessage(event: string, handler: () => void): void {
    this.messageEmitter.off(event, handler);
  }

  public onRequest(event: string, handler: () => void): void {
    this.requestEmitter.on(event, handler);
  }

  public offRequest(event: string, handler: () => void): void {
    this.requestEmitter.off(event, handler);
  }

  public offAll(): void {
    this.messageEmitter.removeAllListeners();
    this.requestEmitter.removeAllListeners();
  }
}

const emitter = new Emitter();

export default emitter;
