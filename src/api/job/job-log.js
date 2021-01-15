import request from '@/utils/request'

export function getJobLogPage(query) {
  return request({
    url: '/system-job-log/get-all-job-log',
    method: 'post',
    data: query
  })
}

export function saveOrUpdateLog(form) {
  return request({
    url: '/api/system/log/saveOrUpdate',
    method: 'post',
    data: form
  })
}

export function deleteJobLog(id) {
  return request({
    url: '/system-job-log/delete-job-log',
    method: 'post',
    params: { id }
  })
}

export function getLogById(id) {
  return request({
    url: '/api/system/log/detail',
    method: 'post',
    data: { 'id': id }
  })
}
