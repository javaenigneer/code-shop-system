import request from '@/utils/request';

// 分页获取商品信息
export function getPageProduct(query) {
  return request({
    url: '/codeworld-goods/product/get-page-product',
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

// 新增商品
export function addProduct(form) {
  return request({
    url: '/codeworld-goods/product/add-product',
    method: 'post',
    data: form
  })
}
// 导入商品到索引库
export function importGoods() {
  return request({
    url: '/codeworld-search/goods/import-goods-to-elasticsearch',
    method: 'post',
  })
}

// 上传图片
export function uploadImage(file) {
  return request({
    url: '/codeworld-upload/upload-image',
    method: 'post',
    data: file
  });
}
