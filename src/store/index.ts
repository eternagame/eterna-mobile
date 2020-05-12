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
    LOGIN: 'LOGIN',
    GET_ACHIEVEMENT_ROADMAP: 'GET_ACHIEVEMENT_ROADMAP',
};

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        strict: process.env.NODE_ENV !== 'production',
        state: {
            isLoading: false,
            loggedIn: false,
            uid: <number | null>null,
            roadmap: <Achievement[]>[],
        },
        mutations: {
            setIsLoading(state, isLoading) {
                state.isLoading = isLoading;
            },
            setLoggedIn(state, {success, uid}) {
                state.loggedIn = success;
                state.uid = uid;
            },
            setRoadmap(state, roadmap) {
                state.roadmap = roadmap;
            },
        },
        actions: {
            async [Action.LOGIN]({ commit }, { username, password }: { username: string, password: string}) {
                commit('setIsLoading', true);
                try {
                    const loginParams = {
                        type: 'login',
                        name: username,
                        pass: password,
                    };
                    const { data } = (await http.post('/login/', new URLSearchParams(loginParams))).data;
                    console.log(data);
                    if (data.success) {
                        commit('setLoggedIn', data);
                    }
                    return data;
                } finally {
                    commit('setIsLoading', false);
                }
            },
            async [Action.GET_ACHIEVEMENT_ROADMAP]({ commit }) {
                commit('setIsLoading', true);
                try {
                    const { data } = (await http.get('/get/?type=side_project_roadmap')).data;
                    if (data.achievement_roadmap) {
                        const roadmap = <Achievement[]>data.achievement_roadmap;
                        commit('setRoadmap', roadmap.filter(a => a.key === 'ten_tools').sort((a, b) => a.level - b.level));
                    }
                } finally {
                    commit('setIsLoading', false);
                }
            },
        },
        modules: {
        },
    });
};
