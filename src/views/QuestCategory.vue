<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                <div>
                    <p><strong>{{title}}</strong></p>
                    <p>{{description}}</p>
                </div>
            </div>
            <b-container id="page-scroll-content">
                <div id="scroll-card-wrapper">
                    <QuestCard
                        v-for="ach in roadmap"
                        :key="ach.title"
                        :imgSrc="resolveUrl(ach.image)"
                        @play="$router.push(`/quests/${ach.key}/${ach.level}?progression=true&tags=${ach.title}`)"
                    />
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
import Vue from 'vue'
import Carousel from '../components/Carousel.vue'
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import QuestCard from '../components/QuestCard.vue'

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
        QuestCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return (this.$store.state.quest_roadmap as Achievement[]).filter(a => a.key == this.$route.params.id);
        },
        title() {
            if (this.$route.params.id === 'eterna_essentials') return 'Eterna Essentials';
            else if (this.$route.params.id === 'ten_tools') return 'Advanced Tutorials';
            else return '';
        },
        description() {
            if (this.$route.params.id === 'eterna_essentials') return 'Review the basics of puzzle solving';
            else if (this.$route.params.id === 'ten_tools') return 'Keep learning with these advanced tutorials';
            else return '';
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
        }
    }
});
</script>

<style lang="scss" scoped></style>
