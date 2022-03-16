<template>
    <section class="nav-bar">
        <div class="nav-button">
            <slot name="left">
                <div @click="goToAbout" class="puzzle-view-about-btn" />
            </slot>
        </div>
        <slot name="center">
            <b-button variant="primary" size="lg"  class="nav-button" id="home-btn" :disabled="atHome" @click="goToHome">
                <div v-bind:class="atHome ? `home-icon` : `home-disabled`"></div>
                Home
            </b-button>
            <b-button variant="primary" size="lg" class="nav-button" id="lab-btn" :disabled="atLabs" @click="goToLabs">
                <div v-bind:class="atLabs ? `flask-icon` : `flask-disabled`"></div>
                Labs
            </b-button>
            <b-button variant="primary" size="lg" class="nav-button" id="puzzle-btn" :disabled="atPuzzles" @click="goToPuzzles">
                <div v-bind:class="atPuzzles ? `puzzle-icon` : `puzzle-disabled`"></div>
                Puzzles
            </b-button>
        </slot>
        <div class="nav-button">
            <slot name="right">
                <div class="puzzle-view-chat-btn" />
            </slot>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.component('puzzle-view-progress-bar', {
    props: {
        value: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 7,
        }
    },
    computed: {
        atHome(): boolean{
            // disable button
            return this.$route.path === "/home";
        },
        atPuzzles(): boolean{
            // disable button
            return this.$route.path === "/puzzles";
        },
        atLabs(): boolean{
            // disable button
            return this.$route.path === "/labs";
        },
        atQuests(): boolean{
            // disable button
            return this.$route.path === "/quests";
        }
    },
    methods:{
        goToAbout() {
            this.$router.push('/about');
        },
        goToHome() {
            this.$router.push('/home');
        },
        goToLabs() {
            this.$router.push('/labs');
        },
        goToPuzzles(){
            this.$router.push('/puzzles');
        },
        goToQuests() {
            this.$router.push('/quests');
        },
    }
})
</script>

<style lang="scss" scoped>

section.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 3vmin;
    position: absolute;
    bottom: 0;
}

.puzzle-view-about-btn {
    background: url('../assets/noun_info.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 6vmin;
    height: 6vmin;
}

.puzzle-view-chat-btn {
    background: url('../assets/Chat.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 9vmin;
    height: 8vmin;
}

button:disabled,
button[disabled]{
  color: #fff; // highlight current tab and also disable it
  opacity: 1;
}

.nav-bar {
    padding: 0;
    display: flex;
    width: 100%;
}

.nav-bar .btn-primary{
    background-color: transparent;
    border-color: transparent;
}

.nav-button{
    color: #ffffff7a; //grey until set by the page
    padding: 0;
    // height: 6.5vmin; Comment this to show labels on mobile
    border-radius: 1vmin;
    text-align: center;
    font-size: 1.5vw;
    line-height: 5.2vmin;
    
}
.nav-button:focus-visible{
    outline:hidden;
}
.btn-primary:not(:disabled):not(.disabled):active{
    background-color: transparent;
    border-color: transparent;
}
.home-icon{
    background-image: url('../assets/home.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.home-disabled{
    background-image: url('../assets/home_disabled.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.flask-icon{
    background-image: url('../assets/flask.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.flask-disabled{
    background-image: url('../assets/flask_disabled.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.puzzle-icon{
    background-image: url('../assets/puzzle.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.puzzle-disabled{
    background-image: url('../assets/puzzle_disabled.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.quests-icon {
    background-image: url('../assets/quests.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.quests-disabled {
    background-image: url('../assets/quests-disabled.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: contain; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 5vmin;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.left-col,
  .right-col {
    font-size: 2vmin;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
.puzzle-progress-bar {
    background-color: rgb(204, 204, 204);
    height: 2.8vmin;
}

.puzzle-progress-bar-circles {
    justify-content: space-between;
    flex-wrap: nowrap;
    top: -4.4vmin;
    position: relative;
}

.circle {
    height: 6vmin;
    width: 6vmin;
    background-color: rgb(204, 204, 204);
    border-radius: 50%;
    overflow: visible;
    display: inline-block;
    font-size: 3.5vmin;
    padding-top: 0.4vmin;
    z-index: 0;
}

.circle-glow {
    background-color: rgb(21, 194, 231);
    box-shadow: 0vmin 0vmin 4vmin 0.5vmin rgb(21, 194, 231);
}

.inner-circle {
    height: 3.5vmin;
    width: 3.5vmin;
    border-radius: 50%;
    background-color: white;
    display: inline-block;
    margin-top: 0.9vmin;
}

.puzzle-progress-bar-icon-test-tube {
    background-image: url('../assets/test-tube.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 3.7vmin;
    height: 3.7vmin;
    display: inline-block;
    margin-top: 0.4vmin;
}
</style>
