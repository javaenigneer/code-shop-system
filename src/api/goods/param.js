import request from '@/utils/request';

// 分页获取参数
export function getPageParam(query) {
  return request({
    url: '/codeworld-goods/param/get-page-param',
    method: 'post',
    data: query
  })
}

// 新增参数
export function addParam(form) {
  return request({
    url: '/codeworld-goods/param/add-param',
    method: 'post',
    data: form
  })
}
// 根据分类Id获取参数
export function getParamByCategoryId(categoryId) {
  return request({
    url: '/codeworld-goods/param/get-param-category-id',
    method: 'post',
    params: {categoryId}
  });
}
// 根据分类Id获取通用参数
export function getSpecialParamByCategoryId(categoryId) {
  return request({
    url: '/codeworld-goods/param/get-special-param-category-id',
    method: 'post',
    params: {categoryId}
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
