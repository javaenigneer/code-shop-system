import request from '@/utils/request';

export function getPageMerchant(query) {
  return request({
    url: '/codeworld-merchant/get-page-merchant',
    method: 'post',

    data: query
  });
}

export function examineMerchant(param) {
  return request({
    url: '/codeworld-merchant/examine-merchant',
    method: 'post',
    data: param
  });
}

export function sendSms(phone) {
  return request({
    url: '/codeworld-sms/send-sms',
    method: 'post',
    params: {phone}
  });
}

export function addMerchant(data) {
  return request({
    url: '/codeworld-merchant/web/register-merchant',
    method: 'post',
    data: data
  });
}











