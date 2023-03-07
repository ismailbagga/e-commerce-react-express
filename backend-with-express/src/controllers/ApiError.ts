export default class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}
