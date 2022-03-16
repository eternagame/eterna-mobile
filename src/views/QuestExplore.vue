<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <HeaderBar></HeaderBar>
        <div class="content">
            <div class="left-block left-aligned">
                <div>
                    <p><strong>Quests</strong></p>
                    <p>Master Eterna and unlock new achievements by completing these challenging quests.</p>
                </div>
            </div>
            <b-container id="puzzle-scroll">
                <div id="puzzle-card-wrapper">
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('eterna_essentials').image)"
                        @play="$router.push(`/quests/category/eterna_essentials`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('ten_tools').image)"
                        @play="$router.push(`/quests/category/ten_tools`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_eterna3d_expo').image)"
                        @play="$router.push(`/quests/side_quest_eterna3d_expo/${getAchAtCurrentLevel('side_quest_eterna3d_expo').level}?puzzle_type=AllChallengesPuzzle&search=:Eterna3D Expo&sort=date_asc`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_just_for_fun').image)"
                        @play="$router.push(`/quests/side_quest_just_for_fun/${getAchAtCurrentLevel('side_quest_just_for_fun').level}?puzzle_type=AllChallengesPuzzle&search=Fun&sort=date`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_eterna100').image)"
                        @play="$router.push(`/quests/side_quest_eterna100/${getAchAtCurrentLevel('side_quest_eterna100').level}?puzzle_type=AllChallengesPuzzle&search=:Eterna100&sort=solved`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_best_lab_practices').image)"
                        @play="$router.push(`/quests/side_quest_best_lab_practices/${getAchAtCurrentLevel('side_quest_best_lab_practices').level}?puzzle_type=AllChallengesPuzzle&search=%5BLab%20Tutorial%5D&sort=date`)"
                    />
                    <TutorialCard
                        :imgSrc="resolveUrl(getAchAtCurrentLevel('side_quest_switch_puzzles').image)"
                        @play="$router.push(`/quests/side_quest_switch_puzzles/${getAchAtCurrentLevel('side_quest_switch_puzzles').level}?puzzle_type=AllChallengesPuzzle&search=switch&switch=checked&sort=date`)"
                    />
                </div>
            </b-container>
        </div>
        <NavBar>
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
            if (allLevels[0].current_level == allLevels[0].maxlevel) return allLevels.find(a => a.level === a.current_level)!;
            return allLevels.find(a => a.level === a.current_level + 1)!;
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
