import request from '@/utils/request';

export function getHttpTrace(query) {
  return request({
    url: '/system-monitor/get-http-trace',
    method: 'post',
    data: query
  });
}
