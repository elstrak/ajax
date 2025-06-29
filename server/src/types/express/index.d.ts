import 'express';

declare module 'express' {
  export interface User {
    _id?: string;
    // Добавьте другие поля пользователя, если нужно
  }

  export interface Request {
    user?: User;
  }
} 