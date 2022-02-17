<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <b-row id="puzzle-view-header">
            <b-col class="d-flex mh-100">
                <b-img class="mh-100" :src="logoSourcePng" />
            </b-col>
            <b-col style="display:flex;">
                <b v-if="lab_access" style="margin:auto auto 0 auto;font-size:4vw;text-transform:uppercase;"></b>
            </b-col>
            <b-col>
                <b-row v-if="loggedIn" style="justify-content:flex-end;margin-top:12px;">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none puzzle-view-button" menu-class="puzzle-view-button" no-caret>
                        <template #button-content>
                            <b style="line-height:6vmin;margin-right:2vmin;vertical-align:bottom;">{{ username }}</b>
                            <div class="puzzle-view-icon-people" />
                        </template>
                        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                    </b-dropdown>
                </b-row>
                <b-row v-else style="justify-content:flex-end;margin-top:12px;">
                    <b-button class="puzzle-view-button" variant="primary" style="margin-right:3vmin" to="login">Log in</b-button>
                    <b-button class="puzzle-view-button" variant="secondary" to="register">Register</b-button>
                </b-row>
            </b-col>
        </b-row>
        <div class="content">
            <div class="left-block left-aligned">
                <div>
                    <p><strong>Puzzles</strong></p>
                    <p>Browse and solve the latest player-created puzzles, from simple shapes to complex and creative designs. New puzzles are added by the community every day.</p>
                </div>
            </div>
            <div class="right-block">
                <FilterBar 
                v-bind:filters="availableFilters"
                @filter="fetchNewPuzzles"/>
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
                        @play="play(parseInt(puzzle.id, 10))"
                    />
                </div>
            </b-container>
        </div>
        </div>
        <b-row id="puzzle-view-footer">
            <b-col>
                <b-row style="justify-content:flex-start;align-items:flex-start;">
                    <router-link to="about">
                        <div class="puzzle-view-about-button" />
                    </router-link>
                </b-row>
            </b-col>
            <!-- TODO: replace with correct logic -->
            <b-col class="col-8" style="padding:0" v-if="true">
                <NavBar/>
            </b-col>
            
            <b-col>
                <b-row style="justify-content:flex-end;align-items:flex-end;">
                    <div @click="openChat" class="puzzle-view-chat-button" />
                </b-row>
            </b-col>
        </b-row>
        <div id="chat-container" class="chat hidden"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FilterBar from '../components/FilterBar.vue';
import NavBar from '../components/NavBar.vue'
import PuzzleCard from '../components/PuzzleCard.vue'
import NavBar from '../components/NavBar.vue'
import { Action, Achievement, PuzzleData, PuzzleItem } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            availableFilters: [
                { value: 'challenge', text: 'Challenges' },
                { value: 'player', text: 'Player' },
                { value: 'single', text: 'Single State' },
                { value: 'notcleared', text: 'Uncleared' },
            ],
            numberOfPuzzles: 9,
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg').default,
        };
    },
    async mounted() {
        try {
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
        NavBar,
        PuzzleCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
        username(): string {
            return this.$store.state.username;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        puzzles(): PuzzleItem[]{
            return this.$store.state.puzzle_list; 
        },
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        }
        
    },
    methods: {
        async fetchNewPuzzles() {
            // Get filters from query, then convert to API's expected parameters
            // Will change with Eterna-Next API
            const query = this.$route.query;
            const filters = `${query.filters}`.split(',');
            let puzzleFilter = `puzzle_type=AllChallengesPuzzle`;
            if (filters.includes("challenge") && !filters.includes("player"))    {puzzleFilter = `puzzle_type=Challenge`}
            if (filters.includes("player")    && !filters.includes("challenge")) {puzzleFilter = `puzzle_type=PlayerPuzzle`}
            const singleFilter = filters.includes("single") ? `single=checked` : `single=false`;
            const clearedFilter = filters.includes("notcleared") ? `notcleared=true` : `notcleared=false`;
            const requestString = `type=puzzles&sort=date&size=${this.numberOfPuzzles}&${puzzleFilter}&${singleFilter}&${clearedFilter}`;
            await this.$store.dispatch(Action.GET_PUZZLES, requestString);
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
            this.$router.replace(`game/${id}`);
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
    padding-right: calc(50% - 22.5vmin);
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
</style>
