import { AxiosError, AxiosResponse } from 'axios';
import LoginInterface from '../interface/login.interface';
import http from './index';

export default class AuthServices {
  login(data: LoginInterface): Promise<AxiosResponse> {
    return http.post('auth', data);
  }

  deleteDeviceId(userId: string): Promise<AxiosResponse<void, AxiosError>> {
    return http.delete(`auth/device/${userId}`);
  }
}
