import request from '@/utils/request';

// 分页获取商品信息
export function getPageCategoryAttribute(query) {
  return request({
    url: '/codeworld-goods/category-attribute/get-page-category-attribute',
    method: 'post',
    data: query
  })
}
// 获取已设置的分类属性
export function getCategoryAttribute() {
  return request({
    url: '/codeworld-goods/category-attribute/get-category-attribute',
    method: 'post'
  })
}

// 新增分类属性
export function addCategoryAttribute(form) {
  return request({
    url: '/codeworld-goods/category-attribute/add-category-attribute',
    method: 'post',
    data: form
  })
}
// 获取该分类是否已设置属性
export function getCategoryStatus(categoryId) {
  return request({
    url: '/codeworld-goods/category-attribute/get-category-status',
    method: 'post',
    params: { categoryId }
  })
}
export function getAttributeByCategoryId(categoryId) {
  return request({
    url: '/codeworld-goods/attribute/get-attribute-category-id',
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
