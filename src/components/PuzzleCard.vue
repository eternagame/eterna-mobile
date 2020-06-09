<template>
    <b-button class="puzzle-card-container" :class="{'puzzle-card-locked': state === 'locked', 'puzzle-card-highlight': highlight}">
        <b-img  class="puzzle-card-image" :src="imgSrc" />
        <div style="justify-content:center;align-items:center">
            <b-button v-if="state === 'unlocked'" class="puzzle-card-button" variant="primary" @click="$emit('play')">
                <b>PLAY</b>
            </b-button>
            <div v-else-if="state === 'locked'" class="puzzle-card-icon-lock" />
            <b-row v-else-if="state === 'completed'" class="puzzle-card-text" style="justify-content:center;align-items:center;">
                <div class="puzzle-card-icon-checkmark" />
                <b>COMPLETED!</b>
            </b-row>
        </div>
    </b-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.component('puzzle-card', {
    props: {
        highlight: {
            type: Boolean,
            default: false
        },
        state: {
            type: String,
            default: 'unlocked'
        },
        imgSrc: {
            type: String,
            default: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png'
        }
    },
})
</script>

<style lang="scss" scoped>
.puzzle-card-container {
    width: 45vmin;
    height: 45vmin;
    display: inline-block;
    border-radius: 2vmin;
    background-color: #008cff15;
    scroll-snap-align: center;
    text-align: center;
    margin-top: 3vmin;
    margin-bottom: 3vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
    padding: 0;
    border: none;
}

.puzzle-card-locked {
    opacity: 0.5;
}

.puzzle-card-highlight {
    box-shadow: 0px 0px 2.5vmin 0.25vmin rgb(21, 194, 231);
}

.puzzle-card-image {
    height: 65%;
    margin-top: 0%;
    margin-bottom: 1vh;
}

.puzzle-card-button {
    margin-top: 3%;
    padding: 0;
    width: 49%;
    height: 6.5vmin;
    border-radius: 1vmin;
    text-align: center;
    font-size: 3.2vmin;
    line-height: 5.2vmin;
}

.puzzle-card-text {
    font-size: 2.5vmin;
    text-align: center;
    transform: translateY(2.5vmin);
    line-height: 0;
}

.puzzle-card-icon-lock {
    background-image: url('../assets/noun_lock_lg.png');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 4.0vmin;
    height: 5.8vmin;
    margin-top: 1vmin;
    display: inline-block;
}

.puzzle-card-icon-checkmark {
    background-image: url('../assets/noun_checkmark_lg.png');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 0.8 * 4.9vmin;
    height: 0.8 * 3.7vmin;
    margin-right: 1vmin;
    display: inline-block;
}
</style>
