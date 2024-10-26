import axios from 'axios';
import qs from 'qs';
import { isEmpty, isNull, omitBy } from 'lodash';
import Helper from '@/utils/helper';

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'http://139.0.5.104:4000/api'
      : 'http://localhost:4000/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

http.interceptors.request.use((config) => {
  config.headers!['Accept'] = 'application/json';
  config.headers!['Content-type'] = 'application/json';
  const token = Helper.getWithExpiry('token');
  if (token) {
    config.headers!['Authorization'] = `Bearer ${token}`;
  }
  if (!isEmpty(config.data)) {
    config.data = omitBy(config.data, isNull);
  }
  return config;
});

http.defaults.paramsSerializer = (params) => {
  const nextParams = { ...params };
  return qs.stringify(nextParams, { encode: false });
};

export default http;
