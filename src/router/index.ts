import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/reset-password',
        name: 'Reset Password',
        component: ResetPassword,
    }
];

const router = new VueRouter({
    routes
});

export default router;
