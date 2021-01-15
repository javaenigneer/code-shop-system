import request from '@/utils/request'

export function getServerInfo() {
  return request({
    url: '/api/server',
    method: 'get'
  })
}

export function getAllUserCount() {
  return request({
    url: '/system-user/get-all-user-count',
    method: 'get'
  })
}

export function getActiveUserCount() {
  return request({
    url: '/system-monitor/get-active-user-count',
    method: 'get'
  })
}
