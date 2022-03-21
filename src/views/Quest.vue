<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <HeaderBar></HeaderBar>
        <div class="content">
            <div class="left-block left-aligned">
                <div>
                    <img :src="resolveUrl(achievement.image)" :alt="achievement.title" style="object-fit: contain; width: 100%; max-height: 60%;"/>
                    <p v-html="description"></p>
                </div>
            </div>
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
                            :cleared="puzzle.cleared"
                            :is3d="parseInt(puzzle.has3d)"
                            :stateCount="puzzle.number_of_states"
                            :madeByPlayer="puzzle['made-by-player'] === '1'"
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
                <div @click="openChat" class="puzzle-view-chat-button" />
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
import PuzzleCard from '../components/PuzzleCard.vue'
import DOMPurify from 'dompurify'

import { Action, Achievement, PuzzleItem, PuzzleList } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            isLoading: true,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_QUEST_ACHIEVEMENT_ROADMAP);
            await this.$store.dispatch(Action.GET_PUZZLES, new URLSearchParams({type: 'puzzles', ...this.$route.query}));
            this.chat = new ChatManager('chat-container', this.$store);
            this.isLoading = false;
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
        PuzzleCard
    },
    computed: {
        achievement(): Achievement {
            return (this.$store.state.quest_roadmap as Achievement[]).find(a => a.key == this.$route.params.id && a.level == +this.$route.params.level)!;
        },
        puzzles(): (PuzzleItem & {cleared: boolean})[] {
            const puzzleList = this.$store.state.puzzle_list as PuzzleList;
            const puzzlesWithCleared = puzzleList.puzzles.map(puzzle => ({
                ...puzzle,
                cleared: puzzleList.cleared.some(cleared => cleared.nid === puzzle.id)
            }));

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
        },
        description(): string{
            return DOMPurify.sanitize(this.achievement.desc);
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
        getPuzImg(nid: string | null){
            return (
            nid &&
            `https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${nid}.svg`
            );
        }
    }
});
</script>

<style lang="scss" scoped>
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
    height: 18vh !important;
    margin-bottom: 15px;
    padding-top: 0 !important;
    margin-left: 3vmin;
    margin-right: 3vmin;
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
    height: 18vh !important;
    display: flex;
    align-items: center;
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
.header-logo {
    max-width: 100%;
    height: 100%;
}
</style>
