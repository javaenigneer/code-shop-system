import request from '@/utils/request';

export function getPageCarouse(query) {
  return request({
    url: '/codeworld-marketing/carouse/get-page-carouse',
    method: 'post',
    data: query
  });
}

export function addCarouse(carouse) {
  return request({
    url: '/codeworld-marketing/carouse/add-carouse',
    method: 'post',
    data: carouse
  });
}
export function updateCarouseStatus(carouse) {
  return request({
    url: '/codeworld-marketing/carouse/update-carouse-status',
    method: 'post',
    data: carouse
  });
}
