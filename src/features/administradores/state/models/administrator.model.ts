import { ShowableEntity } from '../../../../shared/models/utils/showable-entity.model';
import { Role } from '../../../../shared/models/auth/role.enum';
import { AdministratorDTO } from './administrator-dto.model';

export class Administrator extends ShowableEntity {

  constructor(id: string, name: string, email: string, cpf: string, public role: Role) {
    super(id, name, email, cpf);
  }

  static from(administratorDTO: AdministratorDTO) {
    return new Administrator(administratorDTO.id, administratorDTO.name, administratorDTO.email, administratorDTO.cpf, administratorDTO.role)
  }
}
