/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemMonitor = {
  path: '/SystemMonitor',
  component: Layout,
  alwaysShow: true,
  name: '系统监控',
  redirect: 'noredirect',
  meta: {
    title: '系统监控',
    icon: 'component',
    resources: 'systemMonitor'
  },
  children: [
    {
      path: 'http',
      component: () => import('@/views/system-monitor/http'),
      name: '请求追踪',
      meta: { title: '请求追踪', icon: 'my-job', noCache: true, resources: 'http' }
    },
    {
      path: 'login-log',
      component: () => import('@/views/system-monitor/login_log'),
      name: '登录日志',
      meta: { title: '登录日志', icon: 'my-job-log', noCache: true, resources: 'login-log' }
    },
    {
      path: 'active-user',
      component: () => import('@/views/system-monitor/active-user'),
      name: '在线用户',
      meta: { title: '在线用户', icon: 'my-active-user', noCache: true, resources: 'active-user' }
    },
  ]
};

export default systemMonitor
