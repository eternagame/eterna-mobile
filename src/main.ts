import Axios from 'axios';
import { BootstrapVue } from 'bootstrap-vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import createStore from './store';

Vue.use(BootstrapVue);
Vue.use(VueAxios, Axios)

Vue.config.devtools = true;

const http = Axios.create({
    baseURL: process.env.APP_SERVER_URL,
    withCredentials: true,
});

new Vue({
    router,
    store: createStore(http),
    render: h => h(App),
}).$mount('#app');

declare global {
    interface Window {
        navigationbar: any;
    }
}

document.addEventListener('deviceready', () => {
    window.screen.orientation.lock('landscape');
    window.navigationbar.setUp(true);
    StatusBar.hide();
});