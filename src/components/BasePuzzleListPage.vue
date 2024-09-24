<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
       <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                <div>
                    <slot name="left-block"></slot>
                </div>
            </div>
            <div class="page-right-block">
                <FilterBar 
                    v-bind:filters="availableFilters"
                    @filter="fetchNewPuzzles"
                    v-if="!firstQuest"
                />
                <b-container id="page-scroll-content">
                    <div id="scroll-card-wrapper">
                        <PuzzleCard
                            v-for="(puzzle, index) in puzzles"
                            :key="index"
                            :imgSrc="getPuzImg(puzzle.id)"
                            :title="puzzle.title"
                            :folder="puzzle.folder"
                            :reward="puzzle.reward"
                            :username="puzzle.username"
                            :user_pfp="puzzle.userpicture"
                            :num_cleared="puzzle['num-cleared']"
                            :id="puzzle.id"
                            :cleared="isCleared(puzzle)"
                            :is3d="parseInt(puzzle.has3d) === 1"
                            :stateCount="puzzle.number_of_states.toString(10)"
                            :madeByPlayer="puzzle['made-by-player'] === '1'"
                            @play="play(parseInt(puzzle.id, 10))"
                            :locked="isLocked(puzzle.id)"
                            :playable="firstQuest"
                        />
                        <button v-if="morePuzzlesAvailable" class="btn btn-secondary fetch-more-button" @click="fetchMorePuzzles">Load More Puzzles</button>
                    </div>
                </b-container>
            </div>
        </div>
        <NavBar>
            <template v-slot:left v-if="forQuest">
                <button @click="$router.go(-1)" class="back-button">
                    <svg viewBox="0 0 24 24" class="feather feather-arrow-left-circle">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 8 8 12 12 16"></polyline>
                        <line x1="16" y1="12" x2="8" y2="12"></line>
                    </svg>
                </button>
            </template>
            <template v-if="!lab_access" v-slot:center>
                <b-button variant="primary" size="lg" class="nav-button" id="home-btn" @click="$router.push('/')">
                <div class="home-disabled"></div>
                Home
                </b-button>
            </template>
            <template v-slot:right>
                <div @click="openChat" class="nav-button-chat" />
            </template>
        </NavBar>
        <div id="chat-container" class="chat hidden"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FilterBar from '../components/FilterBar.vue';
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'
import PuzzleCard from '../components/PuzzleCard.vue'
import { Action, Achievement, PuzzleItem, PuzzleList } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    props: {
        forQuest: Boolean,
        quest: {
            type: Object,
            default: null
        },
        collection: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            availableFilters: [] as {value: string; text: string}[],
            numberOfPuzzles: 9,
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
        };
    },
    async mounted() {
        try {
            if (this.forQuest) {
                this.availableFilters = [
                    { value: 'notcleared', text: 'Uncleared' },
                ];
            } else {
                this.availableFilters = [
                    { value: 'challenge', text: 'Challenges' },
                    { value: 'player', text: 'Player' },
                    { value: 'single', text: 'Single State' },
                    { value: 'notcleared', text: 'Uncleared' },
                ]
            }

            await this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            await this.fetchNewPuzzles();
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        FilterBar,
        HeaderBar,
        NavBar,
        PuzzleCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        puzzles(): (PuzzleItem & {cleared: boolean})[] {
            const puzzleList = this.$store.state.puzzle_list as PuzzleList;
            if (puzzleList) {
                const puzzlesWithCleared = puzzleList.puzzles.map(puzzle => ({
                    ...puzzle,
                    cleared: puzzleList.cleared ? puzzleList.cleared.some(cleared => cleared.nid === puzzle.id) : false,
                }));

                // When we are displaying a collection, the API does not have a filter for uncleared puzzles, so we do that here
                const filters = `${this.$route.query.filters}`.split(',');
                const filteredPuzzles = filters.includes("notcleared") ? puzzlesWithCleared.filter((puz) => !puz.cleared) : puzzlesWithCleared;

                if (this.$route.query.progression) {
                    // Sort such that puzzle A which specifies its next puzzle is puzzle B is sorted before puzzle A
                    // The first puzzle is the one that has no other puzzle pointing to it
                    const orderedPuzzles: (PuzzleItem & {cleared: boolean})[] = [];
                    let puzzle = filteredPuzzles.find(
                        candidatePuzzle => !filteredPuzzles.some(otherPuzzle => otherPuzzle['next-puzzle'] === candidatePuzzle.id)
                    );
                    while (puzzle) {
                        orderedPuzzles.push(puzzle);
                        const nextPuzzle = puzzle['next-puzzle'];
                        puzzle = filteredPuzzles.find(candidatePuzzle => candidatePuzzle.id === nextPuzzle);
                    }
                    // Add any additional puzzles not part of the next puzzle "chain"
                    orderedPuzzles.push(...filteredPuzzles.filter(candidatePuzzle => !orderedPuzzles.includes(candidatePuzzle)));
                    return orderedPuzzles;
                } else {
                    return filteredPuzzles;
                }
            } else {
                return [];
            }
        },
        lab_access() {
            return this.$store.state.user.lab_access;
        },
        morePuzzlesAvailable(): boolean {
            return this.$store.state.puzzle_list.puzzles.length < parseInt(this.$store.state.puzzle_list.num_puzzles);
        },
        firstQuest(): boolean {
            return !!this.$route.query.firstQuest;
        }
    },
    methods: {
        async fetchNewPuzzles() {
            // Get filters from query, then convert to API's expected parameters
            const query = this.$route.query;

            if (this.collection) {
                await this.$store.dispatch(Action.GET_COLLECTION, {id: this.collection});
            } else {
                const queryParams = new URLSearchParams({type: 'puzzles'});
                
                const filters = `${query.filters}`.split(',');
            
                if (filters.includes("challenge") && !filters.includes("player")) queryParams.append('puzzle_type', 'Challenge');
                else if (filters.includes("player")    && !filters.includes("challenge")) queryParams.append('puzzle_type', 'PlayerPuzzle');
                else if (query.progression) queryParams.append('puzzle_type', 'Progression');
                else queryParams.append('puzzle_type', 'AllChallengesPuzzle')
                
                if (filters.includes("single")) queryParams.append('single', 'checked');
                if (query.switch) queryParams.append('switch', 'checked');
                
                if (filters.includes("notcleared")) queryParams.append('notcleared', 'true');

                if (this.$store.state.uid) queryParams.append('uid', this.$store.state.uid);

                if (query.tags) queryParams.append('tags', query.tags as string);

                if (query.search) queryParams.append('search', query.search as string);
                
                queryParams.append('sort', query.sort ? query.sort as string : 'date');

                if (!query.progression) queryParams.append('size', this.numberOfPuzzles.toString(10));

                await this.$store.dispatch(Action.GET_PUZZLES, queryParams.toString());
            }
        },
        async fetchMorePuzzles() {
            this.numberOfPuzzles += 9;
            await this.fetchNewPuzzles();
        },
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        play(id: number) {
            this.$router.push(`/game/${id}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        getAbsUrl(relUrl: string) {
            return process.env.APP_SERVER_URL + relUrl;
        },
        setProgressFromRoadmap() {
            this.playablePuzzleIndex = Number(this.roadmap[0].current_level);
            this.$forceUpdate();
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('page-scroll-content');
            var wrapper = document.getElementById('scroll-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
        getPuzImg(nid: string | null){
            return (
            nid &&
            `https://s3.amazonaws.com/website-prod-puzzlethumbnails758d7a84-1fjijvlzx9v5u/puzzle_mid_thumbnails/thumbnail${nid}.svg`
            );
        },
        isCleared(puzzle: PuzzleItem & {cleared: boolean}) {
            if (!this.firstQuest) return puzzle.cleared;
            const thispuzidx = this.puzzles.findIndex(puz => puz.id === puzzle.id);
            const currpuzidx = this.puzzles.findIndex(puz => puz.id === this.quest.current_puzzle);
            if (currpuzidx === -1) return true;
            return thispuzidx < currpuzidx;
        },
        isLocked(puzId: string) {
            if (!this.firstQuest || !this.quest) return false;
            const thispuzidx = this.puzzles.findIndex(puz => puz.id === puzId);
            const currpuzidx = this.puzzles.findIndex(puz => puz.id === this.quest.current_puzzle);
            if (currpuzidx === -1) return false;
            return thispuzidx > currpuzidx;
        }
    }
});
</script>

<style lang="scss" scoped></style>
