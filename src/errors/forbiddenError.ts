export class ForbiddenError extends Error {
  constructor() {
    super("Você não tem acesso a este grupo");
    this.name = "ForbiddenError";
  }
}
