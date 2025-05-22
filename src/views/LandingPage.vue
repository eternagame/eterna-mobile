<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <SurveyModal v-if="$store.state.loggedIn"></SurveyModal>
        <HeaderBar></HeaderBar>
        <div class="page-content" v-if="lab_access">
            <Carousel />
        </div>
        <div class="page-content" v-else>
            <div class="page-left-block ">
                <div v-if="playablePuzzleIndex < roadmap.length">
                    <p><strong>Welcome to Eterna, a game where you design RNAs for research by solving puzzles.</strong></p>
                    <p>Complete these puzzles to unlock access to advanced lab challenges.</p>
                    <p><strong>Ready?</strong></p>
                </div>
                <div v-else>
                    <p><strong>Congratulations for completing the tutorials!</strong></p>
                    <p>Log in to help researchers with lab puzzles and solve challenging player-created puzzles.</p>
                    <p><strong>Let's go!</strong></p>
                </div>
            </div>
             <b-container id="page-scroll-content">
                <div id="scroll-card-wrapper">
                <QuestCard
                    v-for="(quest, index) in roadmap"
                    :key="index"
                    :highlight="index === Math.floor(playablePuzzleIndex)"
                    :imgSrc="getAbsUrl(quest.image)"
                    @play="$router.push(`/quests/${quest.key}/${quest.level}?progression=true&tags=${quest.title}&firstQuest=true`)"
                    :state="quest.to_next >= 1 ? 'completed' : (quest.level - 1) > quest.current_level ? 'locked' : 'unlocked'"
                    v-b-popover.click.blur.top.html="{
                        content: quest.desc,
                        fallbackPlacement: ['top'],
                        customClass: 'puzzle-card-popover',
                        boundary: 'viewport'
                    }"
                />
                <QuestCard
                    key="lab"
                    :highlight="lab_access"
                    :imgSrc="getAbsUrl('/puzzle-progression/badges/badge_lab_unlocked.png')"
                    :state="lab_access ? 'completed' : 'locked'"
                />
                <div class="finish-card" style="left:100%;" v-if="lab_access">
                    <div>
                        <p><strong>Now continue to<br/><a href="https://eternagame.org" target="_blank">eternagame.org</a><br/>to keep playing and<br/>join the lab!</strong></p>
                        <p><b-button variant="primary" style="margin-top:10px;text-transform:uppercase;" href="https://eternagame.org">Let's go</b-button></p>
                    </div>
                </div>
            </div>
        </b-container>
        </div>
        <NavBar>
            <template v-if="!lab_access" v-slot:center>
                <ProgressBar :value="playablePuzzleIndex" :max="roadmap.length" />
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
import Carousel from '../components/Carousel.vue'
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import QuestCard from '../components/QuestCard.vue'
import SurveyModal from '../components/SurveyModal.vue';
import { Action, Achievement } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            await this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Carousel,
        HeaderBar,
        NavBar,
        ProgressBar,
        QuestCard,
        SurveyModal,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        lab_access() {
            return this.$store.state.user?.lab_access;
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
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
            }
        },
    }
});
</script>

<style lang="scss" scoped>
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
</style>
