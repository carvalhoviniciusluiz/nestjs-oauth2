import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  /**
   * TODO:
   * Error must be saved and sent by email
   */
  error(message: string, trace: string, context?: string) {
    super.error(message, trace, context);
  }
  /**
   * TODO:
   * Error must be sent by email
   */
  warn(message: string, context?: string) {
    super.warn(message, context);
  }
}
