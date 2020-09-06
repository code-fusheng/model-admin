import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/user',
    name: 'Manage',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/manage/user/user-list'),
        meta: { title: '用户列表', icon: 'user' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/manage/role/role-list'),
        meta: { title: '角色列表', icon: 'role' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/manage/menu/menu-list'),
        meta: { title: '权限列表', icon: 'menu' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/article',
    name: 'article',
    meta: { title: '文章管理', icon: 'article-tool' },
    children: [
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/article/category/category-list'),
        meta: { title: '分类管理', icon: 'type' }
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/article/article-list'),
        meta: { title: '文章管理', icon: 'article' }
      }
    ]
  },
  {
    path: '/operation',
    component: Layout,
    redirect: '/operation/comment',
    name: 'article',
    meta: { title: '操作管理', icon: 'operation' },
    children: [
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/operation/comment/comment-list'),
        meta: { title: '评论管理', icon: 'comment' }
      },
      {
        path: 'good',
        name: 'Good',
        component: () => import('@/views/operation/good/good-list'),
        meta: { title: '点赞管理', icon: 'good' }
      },
      {
        path: 'colletion',
        name: 'Collection',
        component: () => import('@/views/operation/collection/collection-list'),
        meta: { title: '收藏管理', icon: 'collection' }
      }
    ]
  },
  {
    path: '/model',
    component: Layout,
    redirect: '/model/model',
    name: 'Model',
    meta: { title: '模版设计', icon: 'sys-model' },
    children: [
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/model/model/model-list'),
        meta: { title: '常规模版', icon: 'model' }
      },
      {
        path: 'modelplus',
        name: 'ModelPlus',
        component: () => import('@/views/model/modelplus/modelplus-list'),
        meta: { title: '高级模版', icon: 'model-plus' }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/log',
    name: 'System',
    meta: { title: '系统管理', icon: 'sys-control' },
    children: [
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/sys/log/log-list'),
        meta: { title: '系统日志', icon: 'sys-log' }
      },
      {
        path: 'loginLog',
        name: 'Loginlog',
        component: () => import('@/views/sys/loginLog/loginlog-list'),
        meta: { title: '登录日志', icon: 'sys-log' }
      },
      {
        path: 'swagger',
        name: 'Swagger',
        component: () => import('@/views/sys/swagger/swagger-index'),
        meta: { title: '接口文档', icon: 'sys-interface' }
      },
      {
        path: 'druid',
        name: 'Druid',
        component: () => import('@/views/sys/druid/druid-index'),
        meta: { title: '数据监控', icon: 'sys-db' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
