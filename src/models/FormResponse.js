export class FormResponse {
  constructor({ success, message, result = null, error = null }) {
    this.success = success;
    this.message = message;
    this.result = result;
    this.error = error;
  }

  static fromJson(json) {
    return new FormResponse({
      success: json.success,
      message: json.message,
      result: json.result || null,
      error: json.error || null
    });
  }
}
