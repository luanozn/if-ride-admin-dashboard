export class HttpException extends Error {
  constructor(public readonly statusCode: number, message: string, details?: string) {
    super(message);
  }
}
