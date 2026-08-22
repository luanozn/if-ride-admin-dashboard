import { Role } from '../../../../shared/models/auth/role.enum';

export interface AdministratorDTO {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: Role;
}
