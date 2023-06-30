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
import QuestExplore from '../views/QuestExplore.vue';
import QuestCategory from '../views/QuestCategory.vue';
import Quest from '../views/Quest.vue';
import DeleteAccount from '../views/DeleteAccount.vue';

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
        path: '/delete-account',
        component: DeleteAccount,
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
    },
    {
        path: '/quests',
        component: QuestExplore
    },
    {
        path: '/quests/category/:id',
        component: QuestCategory
    },
    {
        path: '/quests/:id/:level',
        component: Quest
    }
];

const router = new VueRouter({
    routes
});

declare var device: any;

router.afterEach(( to, from ) => {
    if ('plausible' in window) {
        plausible('pageview', {
            u: to.path,
            props: {
                logged_in: router.app.$store.state.loggedIn,
                // Platform and version should be available already parsed from the UA string, but
                // we'll also include them here in case it winds up being more accurate (or stops
                // being reported in UA strings like is happening with newer desktop OS versions)
                'device/platform': device.platform,
                'device/version': device.version,
                'device/manufacturer': device.manufacturer,
                'device/model': device.model,
                'device/is_virtual': device.isVirtual,
                'device/resolution/screen': `${window.screen.width}x${window.screen.height}`,
                'device/resolution/screen/width': window.screen.width,
                'device/resolution/screen/height': window.screen.height,
                'device/resolution/page': `${window.innerWidth}x${window.innerHeight}`,
                'device/resolution/page/width': window.innerWidth,
                'device/resolution/page/height': window.innerHeight,
                'language/browser': window.navigator.language,
                'language/browser-fallback': window.navigator.languages.join(',')
            }
        });
    }
});

export default router;
