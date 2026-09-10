import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import MerchantLogin from '../views/MerchantLogin.vue'
import AdminHome from '../views/AdminHome.vue'
import OrderList from '../views/OrderList.vue'
import ProductDetail from '../views/ProductDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/product/:goodsId',
      name: 'product-detail',
      component: ProductDetail
    },
    {
      path: '/order',
      name: 'order',
      component: OrderList,
      meta: { requiresAuth: true }
    },
    {
      path: '/merchant-login',
      name: 'merchant-login',
      component: MerchantLogin
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: AdminHome,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('username')
  const isMerchantAuth = localStorage.getItem('isLoggedIn')

  // 商家后台路由验证
  if (to.path.startsWith('/admin/')) {
    if (isMerchantAuth !== 'true') {
      next('/merchant-login')
      return
    }
  }
  
  // 普通用户路由验证
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
