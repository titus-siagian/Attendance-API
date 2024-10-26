import DefaultParams from './default-params.interface';

export default interface AuditParams extends DefaultParams {
  userId?: string;
  description?: string;
}
