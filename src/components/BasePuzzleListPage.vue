<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
       <HeaderBar></HeaderBar>
        <div class="content">
            <div class="left-block left-aligned">
                <div>
                    <slot name="left-block"></slot>
                </div>
            </div>
            <div class="right-block">
                <FilterBar 
                    v-bind:filters="availableFilters"
                    @filter="fetchNewPuzzles"
                    v-if="!firstQuest"
                />
                <b-container id="puzzle-scroll">
                    <div id="puzzle-card-wrapper">
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
                        <button v-if="morePuzzlesAvailable" class="btn btn-secondary fetch-puzzles-btn" @click="fetchMorePuzzles">Load More Puzzles</button>
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
                <div @click="openChat" class="puzzle-view-chat-button" />
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
                if (!this.$route.query.switch) this.availableFilters.push({ value: 'single', text: 'Single State' });
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

                if (this.$route.query.progression) {
                    // Sort such that puzzle A which specifies its next puzzle is puzzle B is sorted before puzzle A
                    // The first puzzle is the one that has no other puzzle pointing to it
                    const orderedPuzzles: (PuzzleItem & {cleared: boolean})[] = [];
                    let puzzle = puzzlesWithCleared.find(
                        candidatePuzzle => !puzzlesWithCleared.some(otherPuzzle => otherPuzzle['next-puzzle'] === candidatePuzzle.id)
                    );
                    while (puzzle) {
                        orderedPuzzles.push(puzzle);
                        const nextPuzzle = puzzle['next-puzzle'];
                        puzzle = puzzlesWithCleared.find(candidatePuzzle => candidatePuzzle.id === nextPuzzle);
                    }
                    // Add any additional puzzles not part of the next puzzle "chain"
                    orderedPuzzles.push(...puzzlesWithCleared.filter(candidatePuzzle => !orderedPuzzles.includes(candidatePuzzle)));
                    return orderedPuzzles;
                } else {
                    console.log('unordered');
                    return puzzlesWithCleared;
                }
            } else {
                return [];
            }
        },
        lab_access() {
            return this.$store.state.user.lab_access;
        },
        morePuzzlesAvailable(): boolean {
            return this.numberOfPuzzles < parseInt(this.$store.state.puzzle_list.num_puzzles);
        },
        firstQuest(): boolean {
            return !!this.$route.query.firstQuest;
        }
    },
    methods: {
        async fetchNewPuzzles() {
            // Get filters from query, then convert to API's expected parameters
            // Will change with Eterna-Next API
            const query = this.$route.query;
            const filters = `${query.filters}`.split(',');

            const queryParams = new URLSearchParams({type: 'puzzles'});
            
            if (filters.includes("challenge") && !filters.includes("player")) queryParams.append('puzzle_type', 'Challenge');
            else if (filters.includes("player")    && !filters.includes("challenge")) queryParams.append('puzzle_type', 'PlayerPuzzle');
            else if (query.progression) queryParams.append('puzzle_type', 'Progression');
            else queryParams.append('puzzle_type', 'AllChallengesPuzzle')
            
            if (filters.includes("single")) queryParams.append('single', 'checked');
            if (query.switch) queryParams.append('switch', 'checked');
            
            if(filters.includes("notcleared")) queryParams.append('notcleared', 'true');

            if (this.$store.state.uid) queryParams.append('uid', this.$store.state.uid);

            if (query.tags) queryParams.append('tags', query.tags as string);

            if (query.search) queryParams.append('search', query.search as string);
            
            queryParams.append('sort', query.sort ? query.sort as string : 'date');

            if (!query.progression) queryParams.append('size', this.numberOfPuzzles.toString(10));

            await this.$store.dispatch(Action.GET_PUZZLES, queryParams.toString());
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
            var scroll = document.getElementById('puzzle-scroll');
            var wrapper = document.getElementById('puzzle-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
        getPuzImg(nid: string | null){
            return (
            nid &&
            `https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${nid}.svg`
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

<style lang="scss">
.left-block > div {
    margin: 0;
    padding-top: 3vmin;
    overflow-y: scroll;
    font-size: 1.8vw;
}

.right-block {
    display: flex;
    flex-direction: column;
    overflow: scroll;
}

.loading-spinner {
    position: absolute;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.puzzle-view-container {
    padding: 0;
    margin: 0;
    text-align: center;
    touch-action: none;
}

#puzzle-view-header {
    height: 18vh;
    padding-top: 3vmin;
    margin-left: 3vmin;
    margin-right: 3vmin;
    margin-bottom: 3vmin;
}

#puzzle-scroll {
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-right: 0px;
    padding-left: 25px;
    margin-top: 0vmin;
    max-width: unset;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}


#puzzle-view-footer {
    margin-left: 3vmin;
    margin-right: 3vmin;
    height: 18vh;
    align-items: center;
}

#puzzle-card-wrapper {
    position: relative;
    display: inline-block;
    scroll-margin: 0 50vw;
}

.puzzle-card-container {
    transition: transform 0.2s;
}

.puzzle-view-button {
    font-size: 1.5vw;
}

.puzzle-view-chat-button {
    background: url('../assets/Chat.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 9vmin;
    height: 8vmin;
}
.puzzle-view-about-button {
    background: url('../assets/noun_info.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 6vmin;
    height: 6vmin;
}

.puzzle-view-icon-people {
    background-image: url('../assets/DefaultIcon.svg');
    background-position: center top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 6vmin;
    display: inline-block;
    vertical-align: middle;
}

.puzzle-card-popover {
    font-size: 1.5vw;
    max-width: 300px;
}

.finish-card {
    position: absolute;
    top: 0;
    display: inline-flex;
    width: 30vw;
    height: 45vmin;
    margin: 3vmin 1vmin 3vmin 1vmin;
    text-align: center;
    white-space: normal;
    vertical-align: middle;

    > div {
        margin: auto;

        p {
            font-size: 1.5vw;
        }
        strong {
            font-size: larger;
        }
    }
}

.left-aligned {
    text-align: left;
}

.chat {
    text-align: left;
    box-sizing: content-box;
    width: 230px;
    height: 340px;
    position: absolute;
    top: 140px;
    right: 10px;
    border: 1px solid rgba(47, 148, 209, 0.9);
    border-radius: 5px;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    z-index: 1000;

    * {
        box-sizing: content-box;
    }
    button, img {
        padding: 0;
    }
}

@media (max-height: 510px) {
    .chat {
        width: 30%;
        min-width: 230px;
        height: 85%;
        top: 5px;
        right: 5px;
    }
}

.hidden{
  opacity: 0;
}

.fetch-puzzles-btn {
    width: 45vmin;
    height: 45vmin;
    display: inline-block;
    border-radius: 2vmin;
    background-color: #008cff15;
    scroll-snap-align: center;
    text-align: center;
    margin-top: 3vmin;
    margin-bottom: 3vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
    padding: 0;
    border: solid;
    border-color: #21508C;

    // Removes Bootstrap's defaults, which cause sticky active style issue on mobile
    // https://github.com/eternagame/eterna-mobile/issues/29
    &:focus {
        background-color: inherit;
        border-color: #21508C;
    }
}
</style>
