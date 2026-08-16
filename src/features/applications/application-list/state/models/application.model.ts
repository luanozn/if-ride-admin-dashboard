import { ApplicationRequester } from './application-requester.model';
import { ApplicationStatus } from './application-status.enum';
import { ShowableEntity } from '../../../../../shared/models/utils/showable-entity.model';
import { ApplicationDTO } from './application-dto.model';

export class Application extends ShowableEntity {
  constructor(
    id: string,
    public requester: ApplicationRequester,
    public applicationStatus: ApplicationStatus,
    public cnhNumber: string,
    public cnhCategory: string,
    public cnhExpiration: string,
    public reviewedBy?: string,
    public rejectionReason?: string,
    public loading?: boolean,
  ) {
    super(id, requester.name, requester.email, cnhNumber);
  }

  static from(dto: ApplicationDTO): Application {
    return new Application(dto.id, dto.requester, dto. applicationStatus, dto.cnhNumber, dto.cnhCategory, dto.cnhExpiration, dto.reviewedBy, dto.rejectionReason, dto.loading)
  }
}
