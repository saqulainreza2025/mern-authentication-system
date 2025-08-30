class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode >= 200 && statusCode < 300; // true for 2xx codes
    this.statusCode = statusCode;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

export { ApiResponse };
