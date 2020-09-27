import request from '@/utils/request';

export function getRolePage(query) {
  return request({
    url: '/system-role/get-all-role',
    method: 'post',
    data: query
  });
}

export function updateSysRole(form) {
  return request({
    url: '/system-role/update-role',
    method: 'post',
    data: form
  });
}

export function addRole(form) {
  return request({
    url: '/system-role/add-role',
    method: 'post',
    data: form
  });
}

export function deleteRole(roleId) {
  return request({
    url: '/system-role/delete-role',
    method: 'post',
    params: { roleId }
  });
}

export function getRoleById(id) {
  return request({
    url: '/api/system/role/detail',
    method: 'post',
    data: { 'id': id }
  })
}

export function treeUser() {
  return request({
    url: '/api/system/user/treeUser',
    method: 'post'
  })
}

export function getRoleUserByRoleId(data) {
  return request({
    url: '/api/system/userRole/list',
    method: 'post',
    data: data
  })
}

export function getRoleMenuByRoleId(roleId) {
  return request({
    url: '/system-role/get-role-menu',
    method: 'post',
    params: {roleId}
  })
}

export function saveUserRole(data) {
  return request({
    url: '/api/system/userRole/saveUserRole',
    method: 'post',
    data: data
  })
}

export function addRoleMenu(data) {
  return request({
    url: '/system-role/add-role-menu',
    method: 'post',
    data: data
  })
}
