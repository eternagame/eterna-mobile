<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                <div>
                    <p><strong>{{puzzle.title}}</strong></p>
                    <p v-html="description"></p>
                </div>
            </div>
            <b-container id="page-scroll-content">
                <div id="scroll-card-wrapper">
                    <PuzzleCard
                        :imgSrc="getPuzImg(puzzle.id)"
                        :title="puzzle.title"
                        :folder="puzzle.folder"
                        :reward="puzzle.reward"
                        :username="puzzle.username"
                        :user_pfp="puzzle.userpicture"
                        :num_cleared="puzzle['num-cleared']"
                        :playable="true"
                        :cleared="puzzle.cleared"
                        @play="play(parseInt(puzzle.id, 10))"
                    />
                </div>
                <div id="puzzle-info-wrapper">
                    <h3 id="puzzle-info-title">puzzle info</h3>
                    <ul id="puzzle-info-body">
                        <li>
                            <h3>{{ puzzle.username }}</h3>
                        </li>
                        <li>
                            <h3>{{ puzzle.folder }}</h3>
                        </li>
                        <li>
                            <h3>{{ puzzle.reward || 0 }}</h3>
                        </li>
                        <li>
                            <h3>{{ puzzle["num-cleared"] || 0 }}</h3>
                        </li>
                        <li>
                            <h3>{{ puzzle.created }}</h3>
                        </li>
                    </ul>
                </div>
            </b-container>
        </div>
        <NavBar>
            <template v-slot:left>
                <button @click="$router.go(-1)" class="back-button">
                    <svg viewBox="0 0 24 24" class="feather feather-arrow-left-circle">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 8 8 12 12 16"></polyline>
                        <line x1="16" y1="12" x2="8" y2="12"></line>
                    </svg>
                </button>
            </template>
            <template v-slot:right>
                <div @click="openChat" class="nav-button-chat" />
            </template>
        </NavBar>
        <div id="chat-container" class="chat hidden"></div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import DOMPurify from 'dompurify';
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'
import PuzzleCard from '../components/PuzzleCard.vue';
import { Achievement, Action, Puzzle } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            logoSourcePng: require('../assets/logo_eterna.svg'),
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null
        };
    },
    components: {
        HeaderBar,
        NavBar,
        PuzzleCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        puzzle(): Puzzle & {cleared: boolean} {
            return this.$store.state.current_puzzle;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        description(): string{
            return DOMPurify.sanitize(this.puzzle.body);
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
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
            `https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${nid}.svg`
            );
        },
        play(id: number) {
            this.$router.push(`/game/${id}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_PUZZLE, {id: this.$route.params.id});
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.log(error);
        }
    }
})
</script>

<style lang="scss" scoped>
#scroll-card-wrapper {
    margin-right: 45px;
    display: inline-block;
    vertical-align: middle;
}

#puzzle-info-wrapper {
    margin: 3vmin 0;
    display: inline-block;
    vertical-align: middle;
}

#puzzle-info-title {
    color: #2f94d1;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 3vmin;
    display: flex;
    align-items: center;

    &::before {
        content: ""; 
        display: inline-block; 
        width: 2.8vmin;
        height: 2.8vmin;
        margin-right: 10px;
        background: url('../assets/info.svg') no-repeat center / cover;  
    }
}
#puzzle-info-body {
    padding: 0;
    margin: 0;
    margin-top: 3vmin;
    list-style: none;
    li {
        padding: inherit;
        margin: inherit;
        display: flex;
        margin-top: 1vmin;
        &:first-child {
            margin-top: 0;
        }
        h3 {
            font-size: 2.5vmin;
            text-align: left;
            display: flex;
            align-items: center;
            &::before {
                content: "";
                display: inline-block;
                width: 2.5vmin;
                height: 2.5vmin;
                background: url("../assets/profile.svg") no-repeat center / contain;
                margin-right: 10px;    
            }
        }
    }
    li:nth-child(2) {
        h3::before {
            background-image: url("../assets/chemical_bond.svg");
        }
    }
    li:nth-child(3) {
        h3::before {
            background-image: url("../assets/dollar.svg");
        }
    }
    li:nth-child(4) {
        h3::before {
            background-image: url("../assets/people.svg");
        }
    }
    li:nth-child(5) {
        h3::before {
            background-image: url("../assets/calendar.svg");
        }
    }
}

.puzzle-description-body {
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
</style>