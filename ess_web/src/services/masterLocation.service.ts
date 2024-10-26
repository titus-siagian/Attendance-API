import MasterLocationInterface from '@/interface/masterLocation.interface';
import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import { AxiosError, AxiosResponse } from 'axios';
import http from './index';

export default class MasterLocationServices {
  add(
    data: MasterLocationInterface
  ): Promise<
    AxiosResponse<CustomResponse<MasterLocationInterface>, AxiosError>
  > {
    return http.post('master-locations', data);
  }

  get(): Promise<
    AxiosResponse<CustomResponseArray<MasterLocationInterface>, AxiosError>
  > {
    return http.get('master-locations');
  }

  find(
    id: string
  ): Promise<
    AxiosResponse<CustomResponse<MasterLocationInterface>, AxiosError>
  > {
    return http.get(`master-locations/${id}`);
  }

  patch(
    data: MasterLocationInterface
  ): Promise<
    AxiosResponse<CustomResponse<MasterLocationInterface>, AxiosError>
  > {
    return http.patch(`master-locations/${data.id}`, data);
  }

  delete(
    id: string
  ): Promise<
    AxiosResponse<CustomResponse<MasterLocationInterface>, AxiosError>
  > {
    return http.delete(`master-locations/${id}`);
  }
}
