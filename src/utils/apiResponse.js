class ApiResponse {
    constructor(statusCode, data, message = "Success", success="") {
        this.statusCode = success;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400

    }
}

export { ApiResponse}