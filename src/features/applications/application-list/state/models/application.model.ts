import { ApplicationRequester } from './application-requester.model';
import { ApplicationStatus } from './application-status.enum';

export interface Application {
  id: string;
  requester: ApplicationRequester;
  applicationStatus: ApplicationStatus;
  cnhNumber: string;
  cnhCategory: string;
  cnhExpiration: string;
  reviewedBy?: string;
  rejectionReason?: string;
  loading: boolean;
}
