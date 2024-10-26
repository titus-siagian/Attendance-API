import DefaultParams from './default-params.interface';

export default interface UserParams extends DefaultParams {
  name?: string;
  email?: string;
  id?: string;
}
