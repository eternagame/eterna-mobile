<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <b-row id="puzzle-view-header">
            <b-col>
                <b-img :src="logoSourcePng" />
            </b-col>
            <b-col style="display:flex;">
                <b v-if="lab_access" style="margin:auto auto 0 auto;font-size:4vw;text-transform:uppercase;">Labs</b>
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
            <b-container id="puzzle-scroll">
            <div id="puzzle-card-wrapper">
                <LabCard
                    v-for="(lab, index) in labs"
                    :key="index"
                    :title="lab.title"
                    :status_color="getStatusColor(lab.exp_phase)"
                    :status="getStatus(lab.exp_phase)"
                    :imgSrc="getAbsUrl(lab.banner_image)"
                    @link_lab="link_lab(lab.nid)"
                />
                <div class="finish-card" style="left:100%;" v-if="lab_access">
                    <div>
                        <p><strong>Now continue to<br/><a href="https://eternagame.org" target="_blank">eternagame.org</a><br/>to keep playing and<br/>join the OpenVaccine<br/>Challenge!</strong></p>
                        <p><b-button variant="primary" style="margin-top:10px;text-transform:uppercase;" href="https://eternagame.org">Let's go</b-button></p>
                    </div>
                </div>
            </div>
        </b-container>
        </div>
        <b-row id="puzzle-view-footer">
            <b-col>
                <b-row style="justify-content:flex-start;align-items:flex-start;">
                    <router-link to="about">
                        <div class="puzzle-view-about-button" />
                    </router-link>
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
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/TutorialCard.vue'
import NavBar from '../components/NavBar.vue'
import LabCard from '../components/LabCard.vue'
import { Action, Achievement, LabData } from '../store';
import ChatManager from '../ChatManager';

export default Vue.extend({
    data() {
        return {
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg').default,
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_LABS);
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        ProgressBar,
        PuzzleCard,
        LabCard,
        NavBar
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
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        },
        labs(): LabData[]{
            return this.$store.state.labdata;
        }
        
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_LABS);
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        link_lab(nid: String) {
            this.$router.push(`labs/${nid}`);
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
            var scroll = document.getElementById('puzzle-scroll');
            var wrapper = document.getElementById('puzzle-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
    }
});
</script>

<style lang="scss">
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

.content {
    display: flex;
    height: calc(64vh - 15px);
}

.left-block {
    overflow: overlay;
    max-height: 100%;

    position: relative;
    display: flex;
    flex: 0 0 30vw;
    padding-right: 25px;
    padding-left: 50px;

    .status-text {
        font-size: 0.6875rem;
        font-style: normal;
        font-weight: 700;
    }
        > div {
        margin: auto;

        p {
            font-size: 1.5vw;
        }
        strong {
            font-size: larger;
        }
    }

    border-right: 2px solid #2F94D1;
}
</style>
