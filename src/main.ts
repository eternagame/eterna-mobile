import Axios from 'axios';
import { BootstrapVue }  from 'bootstrap-vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import createStore from './store';

// @ts-expect-error Yes, this actually exists
window.open = cordova.InAppBrowser.open;

Vue.use(BootstrapVue);

const http = Axios.create({
    baseURL: process.env.APP_SERVER_URL,
    withCredentials: true,
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
    
    window.addEventListener('keyboardDidShow', () => setTimeout(() => {
        document.activeElement?.scrollIntoView();
    }, 0));

    // Initialize Vue after cordova is fully loaded
    new Vue({
        router,
        store: createStore(http),
        render: h => h(App),
    }).$mount('#app');
});
