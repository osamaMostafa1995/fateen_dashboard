import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory  } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'


function guest(to, from, next){
  // console.log(localStorage.isAuthenticated)
  if(localStorage.isAuthenticated){
      next({name: "الرئيسية"})
  }else{
    next()
  }
}

function guard(to, from, next){
  if(localStorage.isAuthenticated){
      next()
  }else{
    next({name: "الدخول"})
  }
}

const routes = [
  {
    path: '/',
    name: 'الرئيسية',
    component: DefaultLayout,
    // redirect: '/dashboard',

    beforeEnter: guard,

    // children (subviews)
    children: [
      {
        path: '/dashboard',
        name: 'الرئيسية',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
        beforeEnter: guard,

      },
      {
        path: '/cities',
        name: 'المدن',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض المدن',
            component: () => import('@/views/cities/ShowCities'),
          },
          {
            path: 'create',
            name: 'إضافه مدينه',
            component: () => import('@/views/cities/CreateCity'),
          },
        ],
      },
      {
        path: '/categories',
        name: 'الأقسام الرئيسية',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض الأقسام الرئيسية',
            component: () => import('@/views/categories/ShowCategories'),
          },
          {
            path: 'create',
            name: 'إضافه قسم رئيسي',
            component: () => import('@/views/categories/ManageCategories'),
          },
        ],
      },
      {
        path: '/subscription-plans',
        name: 'باقات الإشتراك',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض الباقات',
            component: () => import('@/views/subscription-plans/ShowSubscriptionPlans'),
          },
          {
            path: 'create',
            name: 'إضافه باقة إشتراك',
            component: () => import('@/views/subscription-plans/CreateSubscriptionPlan'),
          },
        ],
      },
      {
        path: '/shaheen-facts',
        name: 'قسم شاهين',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض الحقائق',
            component: () => import('@/views/shaheen-facts/ShowFacts'),
          },
          {
            path: 'create',
            name: 'إضافة حقيقة',
            component: () => import('@/views/shaheen-facts/CreateFact'),
          },
        ],
      },
      {
        path: '/hakeem-articles',
        name: 'قسم حكيم',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض المقالات',
            component: () => import('@/views/hakeem-articles/ShowArticles'),
          },
          {
            path: 'create',
            name: 'إضافة مقالة',
            component: () => import('@/views/hakeem-articles/CreateArticle'),
          },
        ],
      },
      {
        path: '/prizes',
        name: 'قسم الجوائز',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض الجوائز',
            component: () => import('@/views/prizes/ShowPrizes'),
          },
          {
            path: 'create',
            name: 'إضافة جائزة',
            component: () => import('@/views/prizes/CreatePrize'),
          },
        ],
      },
      {
        path: '/landing-page',
        name: 'الصفحه التعريفية',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'home',
            name: 'الرئيسية',
            component: () => import('@/views/landing-page/home'),
          },
          {
            path: 'create',
            name: 'أضافة وسيله اجتماعيه',
            component: () => import('@/views/landing-page/createSocial'),
          },
        ],
      },
      {
        path: '/banners',
        name: 'اللافتات الرئيسية',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'home',
            name: 'الرئيسية',
            component: () => import('@/views/banners/home'),
          },
          {
            path: 'create',
            name: 'أضافة  لافتة رئيسية',
            component: () => import('@/views/banners/create'),
          },
        ],
      },
      {
        path: '/book-categories',
        name: 'أقسام الكتب الرئيسية',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'home',
            name: 'عرض اقسام الكتب ',
            component: () => import('@/views/book-categories/home'),
          },
          {
            path: 'create',
            name: 'أضافة   قسم  جديد ',
            component: () => import('@/views/book-categories/create'),
          },
        ],
      },
      {
        path: '/books-summaries',
        name: 'ملخصات الكتب',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض الملخصات',
            component: () => import('@/views/books-summaries/ShowSummaries'),
          },
           {
            path: 'add',
            name: 'أضافة ملخص جديد',
            component: () => import('@/views/books-summaries/ManageSummary'),
           },
        ],
      },
      {
        path: '/awareness',
        name: 'قسم وعي',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'all',
            name: 'عرض قسم وعي',
            component: () => import('@/views/awareness/ShowAwareness'),
          },
          {
            path: 'manage',
            name: 'إضافة قسم وعي ',
            component: () => import('@/views/awareness/Managewareness'),
          },
        ]
      }
    ],
  },
  {
    path: '/login',
    name: 'الدخول',
    component: () => import('@/views/pages/Login'),
    beforeEnter: guest
  },
  {
    path: '/logout',
    name: 'الخروج',
    component: () => import('@/views/pages/Logout'),
    beforeEnter: guard
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      }
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/pages/Page404'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
