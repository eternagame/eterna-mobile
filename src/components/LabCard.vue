<template>
    <b-button class="lab-card-container" @click="$emit('link_lab')">
        <div class="lab-title" >
            {{title}}
        </div >
        <img  class="lab-card-image" :src="imgSrc" />
        <div class="lab-card-footer d-flex">
        <div class="status-text" :class="`phase_${status_phase}`">
          {{ status }}
          </div>
        </div>
    </b-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.component('lab-card', {
    
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
        },
        title: {
            type: String,
        },
        status:{
            type: String,
        },
        status_phase:{
            type: String,
        }
    },
})
</script>

<style lang="scss" scoped>
.lab-card-container {
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
    border: solid;
    border-color: #21508C;
}
.lab-title{
    white-space: nowrap;
    margin-left: 2vmin;
    margin-right: 2vmin;
    font-size: 3vmin;
    height: 6vmin;
    margin-bottom: 3vmin;
    text-overflow: ellipsis;
    overflow: hidden;
}
.lab-card-footer {
    margin-top: 3vmin;
    margin-bottom: -1.5vmin;
    font-weight: bold;
    line-height: 1vmin;
    font-size: 1.5vmin;
    margin-left: 2vmin;
    text-align: center;
  }

.status-text {
    --margin-left: 16px;
    font-size: 2vmin;
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
.status-indicator {
    width: 1.5vmin;
    height: 1.5vmin;
    border-radius: 50%;
    // margin-top: .8vmin;
    margin-right: 2vmin;
  }


.puzzle-card-highlight {
    box-shadow: 0px 0px 2.5vmin 0.25vmin rgb(21, 194, 231);
}

.lab-card-image {
    width: 100%;
    height: 25vmin;
    object-fit: cover;
}


.puzzle-card-button {
    margin-top: 3%;
    padding: 0;
    width: 49%;
    height: 6.5vmin;
    border-radius: 1vmin;
    text-align: center;
    font-size: 1.5vw;
    line-height: 5.2vmin;
}

.puzzle-card-text {
    font-size: 1.5vw;
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
