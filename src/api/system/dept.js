import request from '@/utils/request';

export function treeDept() {
  return request({
    url: '/codeworld-system/dept/tree-dept',
    method: 'post'
  })
}

export function addDept(form) {
  return request({
    url: '/codeworld-system/dept/add-dept',
    method: 'post',
    data: form
  })
}

export function updateDept(form) {
  return request({
    url: '/codeworld-system/dept/update-dept',
    method: 'post',
    data: form
  })
}

export function deleteMenu(id) {
  return request({
    url: '/codeworld-system/menu/delete-menu',
    method: 'post',
    params: {id}
  });
}

// ========================== 上面是用到的

export function getSysPermissionPage(query) {
    return request({
        url: '/api/system/menu/listPage',
        method: 'post',
        data: query
    });
}

export function getSysPermissionById(id) {
    return request({
        url: '/api/system/menu/getById',
        method: 'post',
        data: { 'id': id }
    });
}
