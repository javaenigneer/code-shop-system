import request from '@/utils/request';

// 分类菜单树
export function treeCategory() {
  return request({
    url: '/codeworld-goods/category/tree-category',
    method: 'post'
  })
}
// 创建分类
export function createCategory(form) {
  return request({
    url: '/codeworld-goods/category/add-category',
    method: 'post',
    data: form
  })
}
// 更新分类
export function updateCategory(form) {
  return request({
    url: '/codeworld-goods/category/update-category',
    method: 'post',
    data: form
  })
}
// 删除分类
export function deleteCategory(categoryId) {
  return request({
    url: '/codeworld-goods/category/delete-category',
    method: 'post',
    params: {categoryId}
  });
}

// 上传图片
export function uploadImage(file) {
  return request({
    url: '/codeworld-upload/upload-image',
    method: 'post',
    data: file
  });
}
