import { Request } from 'express';
import { JwtUser } from './jwt-payload.type';

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
