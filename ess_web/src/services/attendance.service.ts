import AttendanceParams from '@/interface/params/attendance-params.interface';
import AttendanceInterface from '@/interface/attendance.interface';
import ReportInterface from '@/interface/report.interface';
import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import { AxiosError, AxiosResponse } from 'axios';
import { stringify } from 'qs';
import http from './index';

export default class AttendanceServices {
  get(
    query?: AttendanceParams
  ): Promise<
    AxiosResponse<CustomResponseArray<AttendanceInterface>, AxiosError>
  > {
    const params = stringify(query, { indices: false });
    return http.get(`attendance/?${params}`);
  }

  report(
    query?: AttendanceParams
  ): Promise<AxiosResponse<CustomResponse<ReportInterface>, AxiosError>> {
    return http.get('attendance/report', {
      params: query,
    });
  }

  find(
    id: string
  ): Promise<AxiosResponse<CustomResponse<AttendanceInterface>, AxiosError>> {
    return http.get(`attendance/${id}`);
  }

  patch(
    data: AttendanceInterface
  ): Promise<AxiosResponse<CustomResponse<AttendanceInterface>, AxiosError>> {
    return http.patch('attendance', data);
  }
}
