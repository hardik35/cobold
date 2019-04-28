import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Select } from 'element-ui';
import InfiniteLoading from 'vue-infinite-loading';


import axios from 'axios';




Vue.use({
    install(Vue) {
        Vue.prototype.$api = axios.create({
            baseURL: ''
        })
    }
});

Vue.use(InfiniteLoading, { });

Vue.use(Element);
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
