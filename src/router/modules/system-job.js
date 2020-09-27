/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemJob = {
  path: '/systemJob',
  component: Layout,
  alwaysShow: true,
  name: '任务调度',
  redirect: 'noredirect',
  meta: {
    title: '任务调度',
    icon: 'component',
    resources: 'systemJob'
  },
  children: [
    {
      path: 'job',
      component: () => import('@/views/system-job/job'),
      name: '任务管理',
      meta: { title: '任务管理', icon: 'my-job', noCache: true, resources: 'job' }
    },
    {
      path: 'job-log',
      component: () => import('@/views/system-job/job-log'),
      name: '任务日志',
      meta: { title: '任务日志', icon: 'my-job-log', noCache: true, resources: 'job-log' }
    },
  ]
};

export default systemJob
