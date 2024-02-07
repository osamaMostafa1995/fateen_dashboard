export default [
  {
    component: 'CNavItem',
    name: 'الرئيسية',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
    },
  },
  // {
  //   component: 'CNavTitle',
  //   name: 'الأقسام الرئيسية',
  // },
  {
    component: 'CNavGroup',
    name: 'المدن',
    to: '/cities/all',
    icon: 'cil-location-pin',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض المدن',
        to: '/cities/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة مدينة',
        to: '/cities/create',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'الأقسام الرئيسية',
    to: '/categories/all',
    icon: 'cil-location-pin',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض الأقسام الرئيسية',
        to: '/categories/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة قسم رئيسي',
        to: '/categories/create',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'باقات الإشتراك',
    to: '/subscription-plans/all',
    icon: 'cil-list',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض الباقات',
        to: '/subscription-plans/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة باقة',
        to: '/subscription-plans/create',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'ملخصات الكتب',
    to: '/books-summaries/all',
    icon: 'cilBook',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض الملخصات',
        to: '/books-summaries/all',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'نسخ الملخصات',
      //   to: '/books-summaries/manage',
      // },
    ],   
  },
  {
    component: 'CNavGroup',
    name: 'قسم وعي',
    to: '/awareness/all',
    icon: 'cilBook',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض قسم وعي',
        to: '/awareness/all',
      },
      // {
      //   component: 'CNavItem',
      //   name: 'نسخ الملخصات',
      //   to: '/books-summaries/manage',
      // },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'قسم شاهين',
    to: '/shaheen-facts/all',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض الحقائق',
        to: '/shaheen-facts/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة حقيقة',
        to: '/shaheen-facts/create',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'قسم حكيم',
    to: '/hakeem-articles/all',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض المقالات',
        to: '/hakeem-articles/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة مقالة',
        to: '/hakeem-articles/create',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'قسم الجوائز',
    to: '/prizes/all',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'عرض الجوائز',
        to: '/prizes/all',
      },
      {
        component: 'CNavItem',
        name: 'إضافة جائزة',
        to: '/prizes/create',
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'القوائم الأخري',
  },
  {
    component: 'CNavGroup',
    name: 'الإعدادات',
    icon: 'cil-settings',
    items: [
      {
        component: 'CNavItem',
        name: 'الخروج',
        to: '/logout',
      }
    ],
  },
]
