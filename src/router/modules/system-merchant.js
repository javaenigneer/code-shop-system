/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemMerchant = {
  path: '/systemMerchant',
  component: Layout,
  alwaysShow: true,
  name: '商户管理',
  redirect: 'noredirect',
  meta: {
    title: '商户管理',
    icon: 'component',
    resources: 'systemMerchant'
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/system-merchant/merchant'),
      name: '商户信息',
      meta: { title: '商户信息', icon: 'my-user', noCache: true, resources: 'user' }
    },
    {
      path: 'add-merchant',
      component: () => import('@/views/system-merchant/add-merchant'),
      name: '添加商户',
      meta: { title: '添加商户', icon: 'my-user', noCache: true, resources: 'user' },
      hidden: true
    }
  ]
};

export default systemMerchant
