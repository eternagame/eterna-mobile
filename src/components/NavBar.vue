<template>
    <b-container style="padding:0; display: flex; position: relative; top: -2vmin;" class="nav-bar">
            <b-col>
                <b-button variant="primary" size="lg"  class="nav-button" id="home-btn" :disabled="atHome" @click="goToHome()">
                    <div class="home-icon" v-if="atHome">
                    </div>
                    <div class="home-disabled" v-else>
                    </div>
                    Home
                </b-button>
            </b-col>
            <b-col>
                <b-button variant="primary" size="lg" class="nav-button" id="lab-btn" :disabled="atLabs" @click="goToLabs()">
                    <div class="flask-icon" v-if="atLabs">
                    </div>
                    <div class="flask-disabled" v-else>
                    </div>
                    Labs
                </b-button>
            </b-col>
            <!-- <b-col>
                <b-button variant="primary" size="lg" class="nav-button" id="quests-btn" :disabled="atQuests" @click="goToQuests()">
                    <div class="quests-icon" v-if="atQuests">
                    </div>
                    <div class="quests-disabled" v-else>
                    </div>
                    Quests
                </b-button>
            </b-col> -->
            <b-col>
                <b-button variant="primary" size="lg" class="nav-button" id="puzzle-btn" :disabled="atPuzzles" @click="goToPuzzles()">
                    <div class="puzzle-icon" v-if="atPuzzles">
                    </div>
                    <div class="puzzle-disabled" v-else>
                    </div>
                    Puzzles
                </b-button>
            </b-col>
    </b-container>
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
        goToPuzzles(){
            this.$router.push('/puzzles');
        },
        goToLabs() {
            this.$router.push('/labs');
        },
        goToHome() {
            this.$router.push('/home');
        },
        goToQuests() {
            this.$router.push('/quests');
        },
    }
})
</script>

<style lang="scss" scoped>

button:disabled,
button[disabled]{
  color: #fff; // highlight current tab and also disable it
  opacity: 1;
}

.nav-bar .btn-primary{
    background-color: transparent;
    border-color: transparent;
}

.nav-button{
    margin-top: 3%;
    color: #ffffff7a; //grey until set by the page
    padding: 0;
    width: 49%;
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
