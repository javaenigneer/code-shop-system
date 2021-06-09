/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemGoods = {
  path: '/systemGoods',
  component: Layout,
  alwaysShow: true,
  name: '商品管理',
  redirect: 'noredirect',
  meta: {
    title: '商品管理',
    icon: 'component',
    resources: 'systemGoods'
  },
  children: [
    {
      path: 'goods',
      component: () => import('@/views/system-goods/goods'),
      name: '商品信息',
      meta: { title: '商品信息', icon: 'my-user', noCache: true, resources: 'product' }
    },
    {
      path: 'category',
      component: () => import('@/views/system-goods/category'),
      name: '分类管理',
      meta: { title: '分类管理', icon: 'my-sysmenu', noCache: true, resources: 'category' }
    },
    {
      path: 'category-attribute',
      component: () => import('@/views/system-goods/category-attribute'),
      name: '分类属性',
      meta: { title: '分类属性', icon: 'my-role', noCache: true, resources: 'category-attribute' }
    },
    {
      path: 'attribute',
      component: () => import('@/views/system-goods/attribute'),
      name: '属性管理',
      meta: { title: '属性管理', icon: 'my-sysmenu', noCache: true, resources: 'category' },
      hidden: true
    },
    {
      path: 'param',
      component: () => import('@/views/system-goods/param'),
      name: '参数管理',
      meta: { title: '参数管理', icon: 'my-sysmenu', noCache: true, resources: 'category' },
      hidden: true
    },
    {
      path: 'examine-goods',
      component: () => import('@/views/system-goods/examine-goods'),
      name: '审核商品',
      meta: { title: '审核商品', icon: 'my-sysmenu', noCache: true, resources: 'category' },
      hidden: true
    }
  ]
};

export default systemGoods
