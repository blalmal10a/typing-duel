import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import '../boot/firebase'

import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth()
var isLogin = null

// onAuthStateChanged((auth), (user) => {
//   if (auth) {

//     isLogin = user.uid
//     console.log('auth state ganged', isLogin)


//   } else {
//     console.log('user name is null')
//   }
// })

// console.log(change)
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  onAuthStateChanged((auth), (user) => {
    if (auth) {
      isLogin = user.uid

    } else {
      console.log('user name is null')
    }
  })

  Router.beforeEach(async (to, from, next) => {
    const auth = to.meta.requiresAuth
    // const isLogin = getAuth().currentUser
    if (auth && !isLogin) {

      // next('/login')
      next()

    } else {
      next()
    }
  })

  return Router;
});
