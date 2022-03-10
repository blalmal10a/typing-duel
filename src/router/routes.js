const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/Auth.vue"), meta: { name: 'Login' } },
      { path: "/", component: () => import("src/components/typing.vue"), meta: { forbidden: false, requiresAuth: true } },
      { path: "/another", component: () => import("components/anohter.vue"), meta: { forbidden: false, requiresAuth: true } },
      { path: "/multiplayer", component: () => import("components/multiplayer.vue"), meta: { multiplayer: true, forbidden: false, requiresAuth: true } },
      { path: "/home", component: () => import("pages/Home.vue"), meta: { requiresAuth: true } },
      { path: "/test", component: () => import("pages/test.vue"), meta: { test: true } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
