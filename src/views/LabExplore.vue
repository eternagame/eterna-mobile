<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                 <div>
                        <p>
                            <strong>
                                Welcome to the lab!
                            </strong>
                        </p>
                        <p>
                            Here you can participate in RNA design challenges and learn about experimental results of your solutions from researchers.
                        </p>
                    </div>
            </div>
            <div class="page-right-block">
                <FilterBar 
                    v-bind:filters="availableFilters"
                    @filter="fetchNewLabs"/>
                <b-container id="page-scroll-content">
                    <div id="scroll-card-wrapper">
                        <LabCard
                            v-for="(lab, index) in labs"
                            :key="index"
                            :title="lab.title"
                            :status_phase="lab.exp_phase"
                            :status="getStatus(lab.exp_phase)"
                            :imgSrc="lab.banner_image ? getAbsUrl(lab.banner_image) : defaultLabImage"
                            @link_lab="link_lab(lab.nid)"
                        />
                        <button v-if="moreLabsAvailable" class="btn btn-secondary fetch-more-button" @click="fetchMoreLabs">Load More Labs</button>
                    </div>
                </b-container>
            </div>
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
import FilterBar from '../components/FilterBar.vue';
import HeaderBar from '../components/HeaderBar.vue'
import LabCard from '../components/LabCard.vue'
import NavBar from '../components/NavBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/TutorialCard.vue'
import { Action, Achievement, LabData } from '../store';
import ChatManager from '../ChatManager';
import DefaultLabHero from '../assets/slides/hero-lab-default.png';

export default Vue.extend({
    data() {
        return {
            availableFilters: [
                { value: 'active', text: 'Active' },
                { value: 'inactive', text: 'Inactive' }
            ],
            numberOfLabs: 9,
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
            defaultLabImage: DefaultLabHero
        };
    },
    async mounted() {
        try {
            await this.fetchNewLabs();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        FilterBar,
        HeaderBar,
        LabCard,
        NavBar,
        ProgressBar,
        PuzzleCard
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        },
        labs(): LabData[]{
            return this.$store.state.labdata;
        },
        moreLabsAvailable(): boolean {
            return this.numberOfLabs < this.$store.state.lab_total;
        }
    },
    methods: {
        async fetchNewLabs() {
            const query = this.$route.query;
            const filters = `${query.filters}`.split(',');
            const requestString = `type=get_labs_for_lab_cards&size=${this.numberOfLabs}`
            let labFilter = requestString;
            if (filters.includes("active") && !filters.includes("inactive")) {labFilter = `${requestString}&filters=active`}
            if (filters.includes("inactive") && !filters.includes("active")) {labFilter = `${requestString}&filters=inactive`}
            await this.$store.dispatch(Action.GET_LABS, labFilter);
        },
        async fetchMoreLabs() {
            this.numberOfLabs += 9;
            await this.fetchNewLabs();
        },
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_LABS);
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        link_lab(nid: String) {
            this.$router.push(`/labs/${nid}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        getAbsUrl(relUrl: string) {
            if (relUrl.startsWith('http')) {
                return relUrl
            }
            return process.env.APP_SERVER_URL + relUrl;
        },
        getStatus(exp_phase: string){
            if(!exp_phase) return "Results Posted";
            switch (exp_phase) {
            case '1':
                return 'Accepting Submissions';
            case '2':
                return 'Ordering DNA Template';
            case '3':
                return 'Synthesizing RNA';
            case '4':
                return 'Getting Data';
            case '5':
            default:
                return 'Results Posted';
            }
        },
        getStatusColor(exp_phase: string){
            switch (exp_phase) {
            case '1':
                return 'lime';
            case '2':
                return 'yellow';
            case '3':
                return 'purple';
            case '4':
                return 'blue';
            case '5':
            default:
                return 'red';
            }
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('page-scroll-content');
            var wrapper = document.getElementById('scroll-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
    }
});
</script>

<style lang="scss" scoped></style>
