import FamilyInterface from '@/interface/family.interface';
import FamilyParams from '@/interface/params/family-params.interface';
import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import { AxiosError, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import http from './index';

export default class FamilyServices {
  add(
    data: FamilyInterface
  ): Promise<AxiosResponse<CustomResponse<FamilyInterface>, AxiosError>> {
    return http.post('family', data);
  }

  get(
    query?: FamilyParams
  ): Promise<AxiosResponse<CustomResponseArray<FamilyInterface>, AxiosError>> {
    const params = stringify(query, { indices: false });

    return http.get(`family/?${params}`);
  }

  find(
    id: string
  ): Promise<AxiosResponse<CustomResponse<FamilyInterface>, AxiosError>> {
    return http.get(`family/${id}`);
  }

  patch(
    data: FamilyInterface
  ): Promise<AxiosResponse<CustomResponse<FamilyInterface>, AxiosError>> {
    return http.patch('family/' + data.id, data);
  }

  delete(
    id: string
  ): Promise<AxiosResponse<CustomResponse<FamilyInterface>, AxiosError>> {
    return http.delete(`family/${id}`);
  }
}
