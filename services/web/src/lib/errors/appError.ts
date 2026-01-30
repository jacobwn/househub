// export abstract class AppError extends Error {
//   readonly code: string;
//   readonly status: number;

//   protected constructor(message: string, code: string, status = 400) {
//     super(message);

//     this.name = new.target.name; // 👈 important
//     this.code = code;
//     this.status = status;
//   }
// }
// Domain-specific errors
// ts
// Copy code
// // lib/errors/AuthErrors.ts
// import { AppError } from './AppError';

// export class EmailAlreadyInUseError extends AppError {
//   constructor() {
//     super('Email already in use', 'EMAIL_IN_USE', 409);
//   }
// }