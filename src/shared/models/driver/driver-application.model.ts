import { User } from '../auth/user.model';
import { DriverApplicationStatus } from './driver-application-status.enum';

export interface DriverApplication {
  requester: User;
  applicationStatus: DriverApplicationStatus;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiration: string;
  reviewedBy: User;
  rejectionReason: string;
}
