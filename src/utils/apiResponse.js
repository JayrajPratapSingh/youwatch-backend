class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = success;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400

    }
}