<template>
    <b-container style="padding:0; display: flex;">
            <b-col>
                <b-button variant="primary" size="lg"  class="nav-button" @click="goToHome()">Home</b-button>
            </b-col>
            <b-col>
                <b-button variant="primary" size="lg" class="nav-button" @click="goToLabs()">Labs</b-button>
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
    methods:{
        goToLabs() {
            this.$router.replace('/labs');
        },
        goToHome() {
            this.$router.replace('/puzzles');
        },
    }
})
</script>

<style lang="scss" scoped>
.nav-button{
    margin-top: 3%;
    padding: 0;
    width: 49%;
    height: 6.5vmin;
    border-radius: 1vmin;
    text-align: center;
    font-size: 1.5vw;
    line-height: 5.2vmin;
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
