import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import ScheduleInterface from '@/interface/schedule.interface';
import { AxiosError, AxiosResponse } from 'axios';
import http from './index';

export default class ScheduleServices {
  create(
    data: ScheduleInterface
  ): Promise<AxiosResponse<CustomResponse<ScheduleInterface>, AxiosError>> {
    return http.post('employee-schedule', data);
  }

  get(): Promise<
    AxiosResponse<CustomResponseArray<ScheduleInterface>, AxiosError>
  > {
    return http.get('employee-schedule');
  }

  find(
    id: string
  ): Promise<AxiosResponse<CustomResponse<ScheduleInterface>, AxiosError>> {
    return http.get(`employee-schedule/${id}`);
  }

  patch(
    data: ScheduleInterface
  ): Promise<AxiosResponse<CustomResponse<ScheduleInterface>, AxiosError>> {
    return http.patch('employee-schedule/' + data.id, data);
  }

  delete(
    id: number
  ): Promise<AxiosResponse<CustomResponse<ScheduleInterface>, AxiosError>> {
    return http.delete('employee-schedule/' + id);
  }
}
