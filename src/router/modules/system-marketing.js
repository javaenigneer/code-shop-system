/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemMarketing = {
  path: '/systemMarketing',
  component: Layout,
  alwaysShow: true,
  name: '营销管理',
  redirect: 'noredirect',
  meta: {
    title: '营销管理',
    icon: 'component',
    resources: 'systemMarketing'
  },
  children: [
    {
      path: 'index-carouse',
      component: () => import('@/views/system-marketing/index-carouse'),
      name: '首页轮播图',
      meta: { title: '首页轮播图', icon: 'my-user', noCache: true, resources: 'index-carouse' }
    },
    {
      path: 'add-carouse',
      component: () => import('@/views/system-marketing/add-carouse'),
      name: '添加轮播图',
      meta: { title: '添加轮播图', icon: 'my-user', noCache: true, resources: 'index-carouse' },
      hidden: true
    }
  ]
};

export default systemMarketing
