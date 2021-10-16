import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);
Vue.config.productionTip = false

Vue.prototype.axios = axios
axios.defaults.baseURL = "https://a.cfbond.com"
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
