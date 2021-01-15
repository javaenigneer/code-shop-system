import request from '@/utils/request'

export function getLoginLogPage(query) {
  return request({
    url: '/system-login-log/get-all-login-log',
    method: 'post',
    data: query
  })
}

export function deleteLoginLog(id) {
  return request({
    url: '/system-login-log/delete-login-log',
    method: 'post',
    params: { id }
  })
}

