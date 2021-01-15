import request from '@/utils/request';

// 分页获取商品信息
export function getPageAttribute(query) {
  return request({
    url: '/codeworld-goods/attribute/get-page-attribute',
    method: 'post',
    data: query
  })
}
// 更新商品状态 1--上架 0--下架
export function updateProductStatus(id,status) {
  return request({
    url: '/codeworld-goods/product/update-product-status',
    method: 'post',
    params: { id,status }
  })
}

// 新增属性
export function addAttribute(form) {
  return request({
    url: '/codeworld-goods/attribute/add-attribute',
    method: 'post',
    data: form
  })
}

export function deleteMenu(id) {
  return request({
    url: '/system-menu/delete-menu',
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
export function uploadImage(file) {
  return request({
    url: '/codeworld-upload/upload-image',
    method: 'post',
    data: file
  });
}
