<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <b-row id="puzzle-view-header">
            <b-col class="d-flex mh-100">
                <b-img class="mh-100" :src="logoSourcePng" />
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
                <div class="lab-description">
                    <p>
                        <strong>
                        {{lab_title}}
                        </strong>
                    </p>
                    <div style="display:flex;">
                        <div
                        class="status-indicator"
                        :style="{ 'background-color': status_color }"
                        > 
                        </div>
                        <div class="status-text">
                            {{ status }}
                        </div>
                    </div>
                    <div class="lab-description-body" v-html="descriptiontoShow">
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
                                <div class="modal_body" v-html="full_description"/>
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
                            <div class="readmore-scroll">
                                <b-img  class="puzzle-card-image" :src="getBanner" />
                                <div style="padding: 2vmin;">
                                        <div class="modal-title">
                                                Lab Updates!
                                        </div>
                                        <div  style="font-size: 2vmin;" v-html="labUpdates">
                                        </div>
                                </div>
                            </div>
                        </b-modal>
                    </div>
            </div>
        </div>

        <b-container id="puzzle-scroll">
            <div id="puzzle-card-wrapper">
                <LabPuzzleCard
                    v-for="(puzzle, index) in puzzles"
                    :key="index"
                    :title="puzzle.title"
                    :leftNum="puzzle.num_slots"
                    :numSynths="puzzle.num_synthesized"
                    :mySolutions="puzzle.num_solutions"
                    :maxSubmissions="puzzle.player_max_submissions"
                    :rightNum="puzzle.submitted"
                    :imgSrc="getPuzImg(puzzle.nid)"
                    @play="play(parseInt(puzzle.nid, 10))"
                    @review="review(parseInt(puzzle.nid, 10))"
                    @details="details(parseInt(puzzle.nid, 10))"
                />
            </div>
        </b-container>
        </div>
       
        <b-row id="puzzle-view-footer">
            <b-col>
                <b-row style="justify-content:flex-start;align-items:flex-start;">
                    <button @click="$router.go(-1)" class="back-button">
                        <svg viewBox="0 0 24 24" class="feather feather-arrow-left-circle">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 8 8 12 12 16"></polyline>
                            <line x1="16" y1="12" x2="8" y2="12"></line>
                        </svg>
                    </button>
                </b-row>
            </b-col>
            <b-col class="col-8" style="padding:0">
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
 import DOMPurify from 'dompurify';
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/TutorialCard.vue'
import LabPuzzleCard from '../components/LabPuzzleCard.vue'
import NavBar from '../components/NavBar.vue'
import Modal from '../components/Modal.vue'
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
        ProgressBar,
        PuzzleCard,
        LabPuzzleCard,
        Modal,
        NavBar
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading || !this.$store.state.current_lab;
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
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        },
        lab_title(): string{
            return this.$store.state.current_lab.lab.title;
        },
        descriptiontoShow(): string{
            return DOMPurify.sanitize(this.$store.state.current_lab.lab.body)
        },
        full_description(): string{
            return DOMPurify.sanitize(this.$store.state.current_lab.lab.body);
        },
        puzzles(): PuzzleData[] {
            // loop through all rounds? or get first index
            return this.$store.state.current_lab.lab.puzzles?.[0]?.puzzles || [];
        },
        status(): string{
            return this.getStatus(this.$store.state.current_lab.lab.exp_phase);
        },
        status_color(): string{
            return this.getStatusColor(this.$store.state.current_lab.lab.exp_phase);
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
            `https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${nid}.svg`
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
        setProgressFromRoadmap() {
            this.playablePuzzleIndex = Number(this.roadmap[0].current_level);
            this.$forceUpdate();
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('puzzle-scroll');
            var wrapper = document.getElementById('puzzle-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
    }
});
</script>

<style lang="scss">
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
  overflow-y: scroll;
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

.loading-spinner {
    position: absolute;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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
.modal-body{
    padding: 0vmin;
}
.modal-header {
  display:none;
}
.lab-description{
    position: relative;
    top: -1vmin;
    overflow: hidden !important;

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
  .status-text{
      font-size: 2vmin;
      margin-bottom: 2vmin;
  }
.puzzle-view-container {
    padding: 0;
    margin: 0;
    text-align: center;
    touch-action: none;
}

#puzzle-view-header {
    height: 30vh;
    padding-top: 3vmin;
    margin-left: 3vmin;
    margin-right: 3vmin;
}

#puzzle-scroll {
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: y mandatory;
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

.back-button {
    background-color: transparent;
    border: none;

    svg {
        width: 6vmin;
        height: 6vmin;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
}

.lab-description-more {
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 5;
}
</style>
