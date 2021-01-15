import request from '@/utils/request';

export function getSystemPageOrder(query) {
  return request({
    url: '/codeworld-order/get-system-page-order',
    method: 'post',
    data: query
  });
}

export function getOrderInfoById(orderId) {
  return request({
    url: '/codeworld-order/get-order-info-id',
    method: 'post',
    params: {orderId}
  });
}

export function updatePersonalInfo(form) {
  return request({
    url: '/api/system/user/updatePersonalInfo',
    method: 'post',
    data: form
  });
}

export function getUserByDeptId(deptId) {
  return request({
    url: '/codeworld-system/user/get-user-dept-id',
    method: 'post',
    params: {deptId}
  });
}

export function getDeptIdByUserId(userId) {
  return request({
    url: '/codeworld-system/user/get-dept-user-id',
    method: 'get',
    params: {userId}
  });
}

export function addUser(form) {
  return request({
    url: '/codeworld-system/user/add-user',
    method: 'post',
    data: form
  });
}

export function updateSysUser(form) {
  return request({
    url: '/codeworld-system/user/update-user',
    method: 'post',
    data: form
  });
}

export function updateUserStatus(userId,status) {
  return request({
    url: '/codeworld-system/user/update-user-status',
    method: 'post',
    params: {userId,status}
  });
}

export function deleteSysUser(userId) {
  return request({
    url: '/codeworld-system/user/delete-user',
    method: 'post',
    params: {userId}
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
    url: '/codeworld-system/role/get-all-role-no-param',
    method: 'post'
  });
}
