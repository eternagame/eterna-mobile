import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import About from '../views/About.vue';
import Game from '../views/Game.vue';
import Login from '../views/Login.vue';
import LandingPage from '../views/LandingPage.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';
import LabExplore from '../views/LabExplore.vue';
import LabView from '../views/LabView.vue';
import PuzzleExplore from '../views/PuzzleExplore.vue';
import PuzzleView from '../views/PuzzleView.vue';
import BrowseView from '../views/BrowseView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: 'home',
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
        path: '/home',
        component: LandingPage,
    },
    {
        path: '/puzzles',
        component: PuzzleExplore,
    },
    {
        path: '/puzzles/:id',
        component: PuzzleView,
    },
    {
        path: '/labs',
        component: LabExplore,
    },
    {
        path: '/labs/:id',
        component: LabView,
    },
    {
        path: '/game/browse/:id',
        component: BrowseView,
    }
    
];

const router = new VueRouter({
    routes
});

export default router;
