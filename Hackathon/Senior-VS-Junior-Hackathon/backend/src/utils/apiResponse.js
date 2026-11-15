export class ApiResponse {
  constructor(statusCode, message = 'Operation successful', data = {}) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export const sendSuccess = (res, message = 'Operation successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendPaginated = (
  res,
  message = 'Data fetched successfully',
  data = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination,
  });
};
