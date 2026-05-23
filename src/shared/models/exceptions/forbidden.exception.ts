export class ForbiddenException extends Error {
  statusCode = 403

  constructor(message: string) {
    super(message);
  }
}
