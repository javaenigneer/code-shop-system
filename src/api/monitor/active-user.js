import request from '@/utils/request';

export function getAllActiveUser(query) {
  return request({
    url: '/system-monitor/get-all-active-user',
    method: 'get'
  });
}
export function offlineUser(userId) {
  return request({
    url: '/system-monitor/offline-user-id',
    method: 'get',
    params:{userId}
  });
}
