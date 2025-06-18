// types.d.ts
declare namespace Express {
  export interface Request {
    file?: Multer.File;
  }
}
