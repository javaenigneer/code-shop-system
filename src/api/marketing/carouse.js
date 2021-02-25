import request from '@/utils/request';

export function getPageCarouse(query) {
  return request({
    url: '/codeworld-marketing/carouse/get-page-carouse-marketing-system',
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

export function reviewCarouse(reviewCarouseRequest) {
  return request({
    url: '/codeworld-marketing/carouse/review-carouse',
    method: 'post',
    data: reviewCarouseRequest
  });
}

export function deleteCarouse(id) {
  return request({
    url: '/codeworld-marketing/carouse/delete-carouse',
    method: 'post',
    params: {id}
  });
}
