import { AxiosInstance } from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface Achievement {
    key: string;
    level: number;
    current_level: number;
    image: string;
    title: string;
    desc: string;
    maxlevel: number;
    verb: string;
    past: string;
    to_next: number;
    current_puzzle: number;
}

export const Action = {
    AUTHENTICATE: 'AUTHENTICATE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    GET_ACHIEVEMENT_ROADMAP: 'GET_ACHIEVEMENT_ROADMAP',
};

const MAX_LEVEL = 8;

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        strict: process.env.NODE_ENV !== 'production',
        state: {
            isLoadingCount: 0,
            loggedIn: false,
            uid: <number | null>null,
            username: <string | null>null,
            roadmap: <Achievement[]>[],
        },
        getters: {
            isLoading({isLoadingCount}) {
                return isLoadingCount > 0;
            },
        },
        mutations: {
            pushIsLoading(state) {
                ++state.isLoadingCount;
            },
            popIsLoading(state) {
                --state.isLoadingCount;
                if (state.isLoadingCount < 0) {
                    state.isLoadingCount = 0;
                    console.error('Mismatched pushIsLoading and popIsLoading');
                }
            },
            setLoggedIn(state, {loggedIn, uid, username}) {
                state.loggedIn = loggedIn;
                state.uid = uid;
                state.username = username;
                if (loggedIn) {
                    console.log(`Logged in as: ${username} (${uid})`);
                } else {
                    console.log('Not logged in');
                }
            },
            setRoadmap(state, roadmap) {
                state.roadmap = roadmap;
            },
        },
        actions: {
            async [Action.AUTHENTICATE]({ commit }) {
                commit('pushIsLoading');
                try {
                    const { data } = await http.get('/eterna_authenticate.php');
                    if (data === 'NOT LOGGED IN') {
                        commit('setLoggedIn', {loggedIn: false, uid: null, username: null});
                    } else {
                        const matches = data.match(/^(.+)\s(\d+)$/);
                        if (matches && matches.length === 3) {
                            const [, username, uid] = matches;
                            commit('setLoggedIn', {loggedIn: true, uid, username});
                            return true;
                        } else {
                            throw new Error(`Authentication response malformed: ${data}`);
                        }
                    }
                    return false;
                } finally {
                    commit('popIsLoading');
                }
            },
            async [Action.LOGIN]({ commit, dispatch }, { username, password }: { username: string, password: string}) {
                commit('pushIsLoading');
                try {
                    const loginData = new URLSearchParams({
                        type: 'login',
                        name: username,
                        pass: password,
                    });
                    const { data } = (await http.post('/login/', loginData)).data;
                    if (data.success) {
                        if (!await dispatch(Action.AUTHENTICATE)) {
                            throw new Error('Login succeeded, but authentication failed');
                        }
                    }
                    return data;
                } finally {
                    commit('popIsLoading');
                }
            },
            async [Action.LOGOUT]({ commit }) {
                commit('pushIsLoading');
                try {
                    await http.get('/eterna_logout.php');
                    commit('setLoggedIn', {loggedIn: false, uid: null, username: null});
                } finally {
                    commit('popIsLoading');
                }
            },
            async [Action.GET_ACHIEVEMENT_ROADMAP]({ commit }) {
                commit('pushIsLoading');
                try {
                    const { data } = (await http.get('/get/?type=side_project_roadmap')).data;
                    if (data.achievement_roadmap) {
                        const roadmap = <Achievement[]>data.achievement_roadmap;
                        commit('setRoadmap', roadmap.filter(a => a.key === 'ten_tools' && a.level <= MAX_LEVEL).sort((a, b) => a.level - b.level));
                    }
                } finally {
                    commit('popIsLoading');
                }
            },
        },
        modules: {
        },
    });
};
