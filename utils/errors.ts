/**
 * Clase base para errores personalizados de la aplicación
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Esto asegura que el stack trace muestre correctamente la clase que extiende Error
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error para recursos no encontrados (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error para operaciones no autorizadas (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}

/**
 * Error para operaciones prohibidas (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
  }
}

/**
 * Error para datos inválidos (400)
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud incorrecta') {
    super(message, 400);
  }
}

/**
 * Error para errores internos del servidor (500)
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
  }
}