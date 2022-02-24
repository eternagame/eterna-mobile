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

export interface PuzzleItem {
    id: string;
    title: string;
    created: string;
    username: string;
    userpicture: string;
    "made-by-player": string;
    "num-cleared": string;
    type: string;
    "solved-by-bot": string | null;
    reward: string;
    "made-for-lab": string | null;
    folder: string;
    number_of_states: number;
    'next-puzzle': string;
}

export interface ClearedPuzzle {
    nid: string;
    title: string;
    type: string;
    id: string;
}

export interface PuzzleList {
    puzzles: PuzzleItem[];
    cleared: ClearedPuzzle[];
}


export interface Puzzle {
    title: string;
    created: string;
    rna_type: string;
    uid: string;
    username: string;
    userpicture: string;
    reward: string;
    secstruct: string;
    "num-cleared": string;
    "num-submissions": string;
    id: string;
    body: string;
    folder: string | null;
    "made-by-player": string;
    type: string;
    // Format of this stuff is a bit wacky, a bunch of it is specific to EternaJS, and we don't use it
    // anyways, so let's just leave them excluded unless we really need them for some reason.
    // "locks": null,
    // "beginseq": null,
    // "usetails": null,
    // "constraints": "SHAPE,0",
    // "scoring": null,
    // "tutorial-level": "123",
    // "ui-specs": ""
    // "rscript": null,
    // "solved-by-bot": null,
    // "object": null,
    // "annotations": null,
    // "last-round": null,
    // "next-puzzle": null,
    // "objective": null,
    // "check_hairpin": null,
    // "cloud_round": null,
    // "hint": null,
    // "coauthor": "[\"Eterna100\"]",
    // "max-votes": 0
}

export interface LabCardData {
    affiliation: string;
    cover_image?: string;
    created: string;
    exp_phase: string;
    exp_phase_end?: any;
    exp_phase_start?: any;
    founder: string;
    founder_uid: string;
    is_active: boolean;
    nid: string;
    num_slots: string;
    puzzles: string;
    selection?: any;
    title: string;
    banner_image: string;
}  
export interface LabViewData {
    lab: LabData;
    comments: CommentItem[]; // do we need comments ?
    supercomments: []; // ?
    follow: []; // ?
    sum_picks: null;
    my_votes: number;
    uid: string;
}
export interface CommentItem {
    cid: string;
    name: string;
    uid: string;
    comment: string;
    created: string;
    picture: string;
}
export interface LabData {
    nid: string;
    created: string; // timestamp; change to int?
    title: string;
    body: string;
    uid: string;
    puzzles: RoundData[];
    is_featured: null;
    coadmins: string[]; // uids
    project_type: null;
    winner: string; // "1"
    exp_phase: string; // "2"
    exp_phase_start: null;
    exp_phase_end: null;
    synthesis_date: null;
    proposed_date: null;
    affiliation: string;
    email: string;
    selection: null;
    pending: null;
    voters: null;
    cover_image: string;
    conclusion: string | null;
    coadmin_names: string[];
    username: string; // of whome?
    synthesized_solutions: [];
    current_cloud_round: number;
    curr_time: number;
    banner_image: string;
    total_submitted_solutions: number;
    total_designs: number;
    total_submitted_solutions_of_user: number;
    max_designs: number;
    challenge: string;
    carousel_title: string;
    carousel_subtitle: string;
    project_closes: number;
    designs_to_be_synthesized: number;
  }

  export interface RoundData {
    puzzles: PuzzleData[];
    round: number;
    is_playable: boolean;
  }

  export interface PuzzleData {
    id: string;
    nid: string;
    title: string;
    secstruct: string;
    sequence: string;
    rna_type: string;
    object: string;
    constraint: string;
    cover_image: null;
    num_slots: number;
    constraints: string;
    switch_struct?: string[];
    synthesized_solutions: [];
    num_solutions: number;
    my_votes: number;
    submitted: number;
    num_synthesized: number;
    player_max_submissions: number;
  }

export const Action = {
    AUTHENTICATE: 'AUTHENTICATE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    GET_ACHIEVEMENT_ROADMAP: 'GET_ACHIEVEMENT_ROADMAP',
    GET_LABS: 'GET_LABS',
    GET_LAB: 'GET_LAB',
    GET_PUZZLES: 'GET_PUZZLES',
    GET_PUZZLE: 'GET_PUZZLE',
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
            labdata: <LabCardData[]>[],
            current_lab: <LabData | null>null,
            puzzle_list: <PuzzleList | null> null, 
            current_puzzle: <(Puzzle & { cleared: boolean }) | null>null,
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
            setLabs(state, labs){
                state.labdata = labs;
            },
            setCurrentLab(state, lab){
                state.current_lab = lab;
            },
            setPuzzles(state, puzzles){
                state.puzzle_list = puzzles;
            },
            setCurrentPuzzle(state, puzzle){
                state.current_puzzle = puzzle;
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
                        commit('setRoadmap', roadmap.filter(a => a.key === 'eterna_essentials' && a.level <= MAX_LEVEL).sort((a, b) => a.level - b.level));
                    }
                } finally {
                    commit('popIsLoading');
                }
            },
            async [Action.GET_LABS]({ commit }, queryString: string){
                // commit('pushIsLoading');
                try{
                    const { data } = (await http.get(`/get/?${queryString}`)).data;
                    const labdata = <LabCardData[]>data.labs;
                    commit('setLabs', labdata);
                }
                finally{
                    // commit('popIsLoading');
                }
            },
            async [Action.GET_LAB]({ commit }, { id }: { id: string}){
                commit('pushIsLoading');
                try{
                    const { data } = (await http.get(`/get/?type=project&nid=${id}`)).data;
                    const labdata = <LabData>data;
                    commit('setCurrentLab', labdata);
                }
                finally{
                    commit('popIsLoading');
                }
            },
            async [Action.GET_PUZZLES]({ commit }, queryString: string){
                // commit('pushIsLoading');
                try{
                    const { data } = (await http.get(`/get/?${queryString}`)).data;
                    commit('setPuzzles', data);
                }
                finally{
                    // commit('popIsLoading');
                }
            },
            async [Action.GET_PUZZLE]({ commit }, { id }: { id: string}){
                commit('pushIsLoading');
                try{
                    const { puzzle, cleared } = (await http.get(`/get/?type=puzzle&nid=${id}&script=-1`)).data.data;
                    commit('setCurrentPuzzle', {...puzzle, cleared: (cleared as ClearedPuzzle[]).some(clear => clear.nid === puzzle.id)});
                }
                finally{
                    commit('popIsLoading');
                }
            },
        },
        modules: {
        },
    });
};
