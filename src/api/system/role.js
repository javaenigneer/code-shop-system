import request from '@/utils/request';

export function getRolePage(query) {
  return request({
    url: '/codeworld-system/role/get-all-role',
    method: 'post',
    data: query
  });
}

export function updateSysRole(form) {
  return request({
    url: '/codeworld-system/role/update-role',
    method: 'post',
    data: form
  });
}

export function addRole(form) {
  return request({
    url: '/codeworld-system/role/add-role',
    method: 'post',
    data: form
  });
}

export function deleteRole(roleId) {
  return request({
    url: '/codeworld-system/role/delete-role',
    method: 'post',
    params: { roleId }
  });
}

export function getRoleMenuByRoleId(roleId) {
  return request({
    url: '/codeworld-system/role/get-role-menu',
    method: 'post',
    params: {roleId}
  })
}

export function addRoleMenu(data) {
  return request({
    url: '/codeworld-system/role/add-role-menu',
    method: 'post',
    data: data
  })
}
