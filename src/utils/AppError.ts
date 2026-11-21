//src/utils/AppError.ts (un error con código de estado, 
//para que el servicio avise qué pasó y el controlador responda bien):
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}