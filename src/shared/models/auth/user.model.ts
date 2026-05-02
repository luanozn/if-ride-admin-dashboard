import { Role } from './role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
