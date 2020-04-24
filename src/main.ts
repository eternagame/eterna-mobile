import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.devtools = true;

new Vue({
    router,
    store,
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
