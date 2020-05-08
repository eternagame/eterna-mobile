import { AxiosInstance } from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const Action = {
    LOGIN: 'LOGIN',
};

export default function createStore(http: AxiosInstance) {
    return new Vuex.Store({
        strict: process.env.NODE_ENV !== 'production',
        state: {
            isLoading: false,
            loggedIn: false,
            uid: <number | null>null,
        },
        mutations: {
            setIsLoading(state, isLoading) {
                state.isLoading = isLoading;
            },
            setLoggedIn(state, {success, uid}) {
                state.loggedIn = success;
                state.uid = uid;
            }
        },
        actions: {
            async [Action.LOGIN]({ commit }, { username, password }: { username: string, password: string}) {
                commit('setIsLoading', true);
                try
                {
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
        },
        modules: {
        },
    });
};
