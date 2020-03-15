import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
import naver from 'vue-naver-maps';
Vue.use(naver, {
  clientID: 'hsq2fawlhw',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
