<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-container">
        <HeaderBar></HeaderBar>
        <div class="page-content">
            <div class="page-left-block">
                <div class="lab-description">
                    <p>
                        <strong>
                        {{lab_title}}
                        </strong>
                    </p>
                    <div class="status-text" :class="`phase_${status_phase}`">
                        {{ status }}
                    </div>
                    <div class="lab-description-body" v-html="description">
                    </div>
                    <div class="lab-description-more">
                        <b-button block v-b-modal.full-description-modal>Read More</b-button>
                        <b-modal
                            id="full-description-modal"
                            ref="modal"
                            size="xl"
                            header-border-variant="primary"
                            hide-header
                            hide-footer
                        >
                            <div class="modal_container">
                                <div class="modal_header">
                                <b-img  class="img-fluid" :src="getBanner" />
                                <div class="modal_title">{{lab_title}}</div>
                                </div>
                                <div class="modal_body" v-html="description"/>
                            </div>
                        </b-modal>
                        <b-button block v-b-modal.lab-updates-modal v-if="labUpdates">Lab Updates</b-button>
                        <b-modal
                            id="lab-updates-modal"
                            ref="modal"
                            size="xl"
                            header-border-variant="primary"
                            hide-header
                            hide-footer
                            >
                            <div class="modal_container">
                                <div class="modal_header">
                                <b-img  class="img-fluid" :src="getBanner" />
                                <div class="modal_title">Lab Updates!</div>
                                </div>
                                <div class="modal_body" v-html="labUpdates"/>
                            </div>
                        </b-modal>
                    </div>
            </div>
        </div>

        <b-container id="page-scroll-content">
            <div id="scroll-card-wrapper">
                <LabPuzzleCard
                    v-for="(puzzle, index) in puzzles"
                    :key="index"
                    :title="puzzle.title"
                    :numSlots="puzzle.num_slots"
                    :numSynths="puzzle.num_synthesized"
                    :mySolutions="puzzle.num_solutions"
                    :maxSubmissions="puzzle.player_max_submissions"
                    :numSubmitted="puzzle.submitted"
                    :imgSrc="getPuzImg(puzzle.nid)"
                    @play="play(parseInt(puzzle.nid, 10))"
                    @review="review(parseInt(puzzle.nid, 10))"
                    @details="details(parseInt(puzzle.nid, 10))"
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
import DOMPurify from 'dompurify';
import HeaderBar from '../components/HeaderBar.vue'
import LabPuzzleCard from '../components/LabPuzzleCard.vue'
import NavBar from '../components/NavBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/TutorialCard.vue'
import { Action, Achievement, PuzzleData } from '../store';
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
            await this.$store.dispatch(Action.GET_LAB, {id: this.$route.params.id});
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        HeaderBar,
        LabPuzzleCard,
        NavBar,
        ProgressBar,
        PuzzleCard
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading || !this.$store.state.current_lab;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        },
        lab_title(): string{
            return this.$store.state.current_lab.lab.title;
        },
        description(): string{
            return DOMPurify.sanitize(this.$store.state.current_lab.lab.body);
        },
        puzzles(): PuzzleData[] {
            // loop through all rounds? or get first index
            return this.$store.state.current_lab.lab.puzzles?.[0]?.puzzles || [];
        },
        status(): string{
            return this.getStatus(this.$store.state.current_lab.lab.exp_phase);
        },
        status_phase(): string{
            return this.$store.state.current_lab.lab.exp_phase;
        },
        getBanner(): string{
            if (this.$store.state.current_lab.lab.banner_image?.startsWith('http')) {
                return this.$store.state.current_lab.lab.banner_image
            }
            return process.env.APP_SERVER_URL + this.$store.state.current_lab.lab.banner_image;
        },
        labUpdates(): string{
            return this.$store.state.current_lab.lab.conclusion
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.GET_LAB, {id: this.$route.params.id});
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
        review(id: number) {
            this.$router.push(`/game/browse/${id}`);
        },
        details(id: number) {
            this.$router.push(`/puzzles/${id}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        getAbsUrl(relUrl: string) {
            return process.env.APP_SERVER_URL + relUrl;
        },
        getPuzImg(nid: string | null){
            return (
            nid &&
            `https://s3.amazonaws.com/website-prod-puzzlethumbnails758d7a84-1fjijvlzx9v5u/puzzle_mid_thumbnails/thumbnail${nid}.svg`
            );
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
.modal_container {
  height: calc(100vh - 3.5rem);
  padding-bottom: 2rem;
  overflow: hidden;
  border: 2px solid #043468;
  border-radius: 0.3rem;
}

.modal_header {
  position: relative;
  height: 40%;
  width: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.modal_title {
  position: absolute;
  bottom: 0;
  left: 0;
  font-weight: 700;
  font-size: 20px;
  padding: 0.75rem 1.25rem;
}

.modal_body {
  font-size: 3vmin;
  overflow-y: auto;
  height: 60%;
  padding: 0rem 1rem;
  margin-right: 1rem;
  margin-top: 0.75rem;
  
  &::-webkit-scrollbar {
      width: 3px;
    }
    
    &::-webkit-scrollbar-track {
        background-color: #052651;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #2F94D1;
    }
}

.modal-title{
    width: 100%;
    font-size: 6vmin;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    height: 40vmin;
    top: -1vmin;
}
::v-deep .modal-body{
    padding: 0vmin;
}

.lab-description{
    position: relative;
    top: -1vmin;
    overflow: hidden !important;
    height: 100%;

    &::after {
        // Horrible hack to add fade-out to bottom of description
        content: "";
        width: 100%;
        height: 80px;
        position: absolute;
        bottom: 0px;
        background-image: linear-gradient(to bottom, transparent, #032a4f 50%);
    }

    p {
        strong {
            font-size: 1rem;
            font-style: normal;
            font-weight: 700;
        }
    }
}
.lab-description-body {
    font-style: normal;
    font-weight: 400;
    margin-bottom: 2vmin;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
.puzzle-card-image {
    width: 100%;
    height: 40vmin;
    object-fit: contain;
    position: relative;
    top: -2vmin;
}
.status-indicator {
    width: 1.5vmin;
    height: 1.5vmin;
    border-radius: 50%;
    // margin-top: .8vmin;
    margin-right: 2vmin;
  }
.status-text {
    font-size: 0.6875rem;
    font-style: normal;
    font-weight: 700;

    --margin-left: 16px;
    position: relative;
    margin: 0 0 var(--margin-left) var(--margin-left);

    &::before {
        content: '';
        width: 1.5vmin;
        height: 1.5vmin;
        position: absolute;
        left: calc(-1 * var(--margin-left));
        top: calc(50% - 0.75vmin);
        border-radius: 50%;
        background-color: red;
    }
    &.phase_1::before {
        background-color: lime;
    }
    &.phase_2::before {
        background-color: yellow;
    }
    &.phase_3::before {
        background-color: purple;
    }
    &.phase_4::before {
        background-color: blue;
    }
}

.lab-description-more {
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 5;
}
</style>
