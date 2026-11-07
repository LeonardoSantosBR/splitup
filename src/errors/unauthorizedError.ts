export class UnauthorizedError extends Error {
  constructor() {
    super("É necessária autenticação.");
    this.name = "UnauthorizedError";
  }
}
