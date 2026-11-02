export class ForbiddenError extends Error {
  constructor() {
    super("You do not have access to this group");
    this.name = "ForbiddenError";
  }
}
