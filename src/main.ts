import Axios from 'axios';
import { BootstrapVue }  from 'bootstrap-vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import createStore from './store';

Vue.use(BootstrapVue);

const http = Axios.create({
    baseURL: process.env.APP_SERVER_URL,
    withCredentials: true,
});
const store = createStore(http);
const csrfHostname = new URL(process.env.APP_SERVER_URL ?? '', window.location.toString()).hostname;
http.interceptors.request.use((config) => {
    if (config.url && new URL(config.url, process.env.APP_SERVER_URL ?? window.location.toString()).hostname === csrfHostname) {
        config.headers = config.headers || {};
        config.headers['x-csrf-token'] = store.state.csrfToken;
    }
    return config;
});
Vue.use(VueAxios, http);

declare global {
    interface Window {
        navigationbar: any;
    }
}
declare var StatusBar: any;
declare var wkWebView: any;

document.addEventListener('deviceready', () => {
    // @ts-expect-error Yes, this actually exists
    window.open = cordova.InAppBrowser.open;

    window.navigationbar.setUp(true);
    StatusBar.hide();

    // This syncs the cookies on iOS devices when the app initializes.
    // This ensures that the login response cookie will be sent with all subsequent requests.
    if (typeof wkWebView !== 'undefined' && process.env.INJECT_COOKIE_DOMAIN) {
        const cookies = [{
            domain: process.env.INJECT_COOKIE_DOMAIN,
            name: 'foo', value: 'bar',
        }];
        wkWebView.injectCookie(cookies);
    }
    
    // Initialize Vue after cordova is fully loaded
    new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount('#app');
});
