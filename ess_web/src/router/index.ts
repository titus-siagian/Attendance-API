import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/Setting/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/users/create',
    name: 'CreateUser',
    component: () => import('@/views/Users/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/users/update/:id',
    name: 'UpdateUsers',
    component: () => import('@/views/Users/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/company',
    name: 'Company',
    component: () => import('@/views/Company/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/company/create',
    name: 'CreateCompany',
    component: () => import('@/views/Company/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/company/update/:id',
    name: 'UpdateCompany',
    component: () => import('@/views/Company/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/division',
    name: 'Division',
    component: () => import('@/views/Division/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/division/create',
    name: 'CreateDivision',
    component: () => import('@/views/Division/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/division/update/:id',
    name: 'UpdateDivision',
    component: () => import('@/views/Division/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/subdivision',
    name: 'Subdivision',
    component: () => import('@/views/Subdivision/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/subdivision/create',
    name: 'CreateSubdivision',
    component: () => import('@/views/Subdivision/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/subdivision/update/:id',
    name: 'UpdateSubdivision',
    component: () => import('@/views/Subdivision/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/department',
    name: 'Department',
    component: () => import('@/views/Department/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/department/create',
    name: 'CreateDepartment',
    component: () => import('@/views/Department/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/department/update/:id',
    name: 'UpdateDepartment',
    component: () => import('@/views/Department/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/masterlocation',
    name: 'MasterLocation',
    component: () => import('@/views/MasterLocation/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/masterlocation/create',
    name: 'CreateMasterLocation',
    component: () => import('@/views/MasterLocation/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/masterlocation/update/:id',
    name: 'UpdateMasterLocation',
    component: () => import('@/views/MasterLocation/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('@/views/Attendance/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/attendance/detail/:id',
    name: 'DetailAttendance',
    component: () => import('@/views/Attendance/detail.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/family',
    name: 'Family',
    component: () => import('@/views/Family/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/family/create',
    name: 'CreateFamily',
    component: () => import('@/views/Family/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/family/update/:id',
    name: 'UpdateFamily',
    component: () => import('@/views/Family/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/views/Schedule/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/schedule/create',
    name: 'CreateSchedule',
    component: () => import('@/views/Schedule/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/schedule/update/:id',
    name: 'UpdateSchedule',
    component: () => import('@/views/Schedule/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: () => import('@/views/Announcement/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/announcement/create',
    name: 'CreateAnnouncement',
    component: () => import('@/views/Announcement/create.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/announcement/update/:id',
    name: 'UpdateAnnouncement',
    component: () => import('@/views/Announcement/update.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  {
    path: '/audit',
    name: 'Audit',
    component: () => import('@/views/Audit/view.vue'),
    meta: {
      layout: 'AppLayoutDashboard',
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.name === 'Login' && isAuthenticated != null) {
    next({ name: 'Users' });
  } else if (to.name !== 'Login' && isAuthenticated == null) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
