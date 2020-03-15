import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './views/Home.vue'
import store from './store'


Vue.use(Router)
//router guard Store에 accessToken이 없을 때 login page로 푸쉬 
const requireAuth = () => (to, from, next) => {
	if (store.state.accessToken !== '') {
	  return next();
	}
	next('/login');
	// return next();
};


export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
          {
              path: '/',
              name: 'home',
              component: HomePage,
              beforeEnter: requireAuth()
          },
  ]
})

