export default class HttpError extends Error {
  private status: number;
  private errorCode: string;
  private details: any;

  constructor(status: number, errorCode: string, message: string, details: any = null) {
    super();
    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    this.details = details;
  }

  public getStatus(): number {
    return this.status;
  }

  public getErrorCode(): string {
    return this.errorCode;
  }

  public getMessage(): string {
    return this.message;
  }

  public getDetails(): any {
    return this.details;
  }
}
