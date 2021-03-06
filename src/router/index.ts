import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import About from '../views/About.vue';
import Game from '../views/Game.vue';
import Login from '../views/Login.vue';
import PuzzleView from '../views/PuzzleView.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: 'puzzles',
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/reset-password',
        component: ResetPassword,
    },
    {
        path: '/game/:puzzle',
        component: Game,
    },
    {
        path: '/puzzles',
        component: PuzzleView,
    }
];

const router = new VueRouter({
    routes
});

export default router;
