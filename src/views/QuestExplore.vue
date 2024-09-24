<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                <div>
                    <p><strong>Quests</strong></p>
                    <p>Master Eterna and unlock new achievements by completing these challenging quests.</p>
                </div>
            </div>
            <b-container id="page-scroll-content">
                <div id="scroll-card-wrapper">
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_welcome_to_the_lab').image)"
                        @play="$router.push(`/quests/side_quest_welcome_to_the_lab/${getAchAtCurrentLevel('side_quest_welcome_to_the_lab').level}`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_best_lab_practices').image)"
                        @play="$router.push(
                            getCurrentPuzzle('side_quest_best_lab_practices')
                            ? `/puzzles/${getCurrentPuzzle('side_quest_best_lab_practices')}`
                            : `/quests/side_quest_best_lab_practices/${getAchAtCurrentLevel('side_quest_best_lab_practices').level}?search=%5BLab%20Tutorial%5D&sort=date`
                        )"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_eterna3d_expo').image)"
                        @play="$router.push(`/quests/side_quest_eterna3d_expo/${getAchAtCurrentLevel('side_quest_eterna3d_expo').level}?search=:Eterna3D Expo&sort=date_asc`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_eterna100').image)"
                        @play="$router.push(`/quests/side_quest_eterna100/${getAchAtCurrentLevel('side_quest_eterna100').level}?search=:Eterna100&sort=solved`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_switch_puzzles').image)"
                        @play="$router.push(
                            getCurrentPuzzle('side_quest_switch_puzzles')
                            ? `/puzzles/${getCurrentPuzzle('side_quest_switch_puzzles')}`
                            : `/quests/side_quest_switch_puzzles/${getAchAtCurrentLevel('side_quest_switch_puzzles').level}?switch=true&search=switch&sort=date`
                        )"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_just_for_fun').image)"
                        @play="$router.push(
                            getCurrentPuzzle('side_quest_just_for_fun')
                            ? `/puzzles/${getCurrentPuzzle('side_quest_just_for_fun')}`
                            : `/quests/side_quest_just_for_fun/${getAchAtCurrentLevel('side_quest_just_for_fun').level}?search=Fun&sort=date`
                        )"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('ten_tools').image)"
                        @play="$router.push(`/quests/category/ten_tools`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('eterna_essentials').image)"
                        @play="$router.push(`/quests/category/eterna_essentials`)"
                    />
                </div>
            </b-container>
        </div>
        <NavBar>
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
import TutorialCard from '../components/TutorialCard.vue'

import { Action, Achievement } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_QUEST_ACHIEVEMENT_ROADMAP);
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
        TutorialCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return this.$store.state.quest_roadmap;
        }
    },
    methods: {
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        resolveUrl(path: string) {
            if (path.startsWith('http')) return path;
            if (path.startsWith('/')) return process.env.APP_SERVER_URL + path;
            return process.env.APP_SERVER_URL + '/' + path;
        },
        getAchAtCurrentLevel(key: string) {
            const allLevels = this.roadmap.filter(a => a.key === key);
            if (+allLevels[0].current_level === +allLevels[0].maxlevel) return allLevels.find(a => +a.level === +a.current_level)!;
            return allLevels.find(a => a.level === +a.current_level + 1)!;
        },
        getCurrentPuzzle(key: string) {
            return this.getAchAtCurrentLevel(key).current_puzzle
        }
    }
});
</script>

<style lang="scss" scoped></style>
