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

function tryGAUpdate(path: string) {
    const clientId = localStorage.getItem('ga-client-id');

    // NOTE: Technically, this could lead to a race condition where we have two pages queued
    // and the client is only ready after we handle the second one, causing us to mark the first
    // page as the current one (and sending the events out of order). However, in reality,
    // the clientId value *should* be available before we hit this code anyways and it's even
    // *more* unlikely that we'll have another navigation event (after the initial page load)
    // before it's available. This is a hack, but we'll ideally not be staying on GA for too long
    // anyways.
    if (!clientId) {
        setTimeout(() => tryGAUpdate(path), 50);
    }

    gtag('config', 'G-022RW9V497', {
        'page_path': path,
        'client_id': clientId,
        checkProtocolTask: null,
        storage: 'none',
    });
}

router.afterEach(( to, from ) => {
    tryGAUpdate(to.path);
});

export default router;
