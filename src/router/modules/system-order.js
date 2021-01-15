/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemOrder = {
  path: '/systemOrder',
  component: Layout,
  alwaysShow: true,
  name: '订单管理管理',
  redirect: 'noredirect',
  meta: {
    title: '订单管理',
    icon: 'component',
    resources: 'systemOrder'
  },
  children: [
    {
      path: 'order',
      component: () => import('@/views/system-order/order'),
      name: '订单列表',
      meta: { title: '订单列表', icon: 'my-user', noCache: true, resources: 'user' }
    },
    {
      path: 'order-detail',
      component: () => import('@/views/system-order/order-detail'),
      name: '订单详情',
      meta: { title: '订单详情', icon: 'my-sysmenu', noCache: true, resources: 'category' },
      hidden: true
    }
  ]
};

export default systemOrder
