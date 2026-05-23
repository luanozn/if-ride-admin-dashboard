import { JwtPayload } from 'jwt-decode';

export interface IfRideJwtPayload extends JwtPayload {
  role: string;
}
