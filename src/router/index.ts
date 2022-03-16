import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import About from '../views/About.vue';
import BrowseView from '../views/BrowseView.vue';
import Game from '../views/Game.vue';
import LabExplore from '../views/LabExplore.vue';
import LabView from '../views/LabView.vue';
import LandingPage from '../views/LandingPage.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Settings from '../views/Settings.vue';
import Profile from '../views/Profile.vue';
import PuzzleExplore from '../views/PuzzleExplore.vue';
import PuzzleView from '../views/PuzzleView.vue';

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
        path: '/profile',
        component: Profile,
    },
    {
        path: '/settings',
        component: Settings,
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

router.afterEach(( to, from ) => {
    ga('send', 'pageview', to.path);
});

export default router;
