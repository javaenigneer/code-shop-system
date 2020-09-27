import request from '@/utils/request';

export function getSysJob(query) {
  return request({
    url: '/system-job/get-all-job',
    method: 'post',
    data: query
  });
}

export function getSysUserList(query) {
  return request({
    url: '/api/system/user/list',
    method: 'post',
    data: query
  });
}

export function updatePersonalInfo(form) {
  return request({
    url: '/api/system/user/updatePersonalInfo',
    method: 'post',
    data: form
  });
}

export function addJob(form) {
  return request({
    url: '/system-job/add-job',
    method: 'post',
    data: form
  });
}

export function updateSysUser(form) {
  return request({
    url: '/system-user/update-user',
    method: 'post',
    data: form
  });
}

export function updateJobStatus(jobId,status) {
  return request({
    url: '/system-job/update-job-status',
    method: 'post',
    params: {jobId,status}
  });
}

export function deleteJob(jobId) {
  return request({
    url: '/system-job/delete-job',
    method: 'post',
    params: {jobId}
  });
}

export function getSysUserById(id) {
  return request({
    url: '/api/system/user/getById',
    method: 'post',
    data: {'id': id}
  });
}
// 获取全部角色无参数
export function getAllListNoParam() {
  return request({
    url: '/system-role/get-all-role-no-param',
    method: 'post'
  });
}
