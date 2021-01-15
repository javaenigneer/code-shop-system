import request from '@/utils/request';

export function treeMenu() {
  return request({
    url: '/codeworld-system/menu/tree-menu',
    method: 'post'
  })
}

export function createMenu(form) {
  return request({
    url: '/codeworld-system/menu/add-menu',
    method: 'post',
    data: form
  })
}

export function updateMenu(form) {
  return request({
    url: '/codeworld-system/menu/update-menu',
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
