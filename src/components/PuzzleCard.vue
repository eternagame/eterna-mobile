<template>
    <b-button class="puzzle-card-container" >
        
        <div class="puzzle-card-title">
            {{title}}
        </div>
        <b-img  class="puzzle-card-image" :src="imgSrc" />
        <div class="row-position">
        <b-row class="mb-2">
            <b-col cols="6" >
                <div class="left-col">
                    <slot name="left-icon">
                        <div class="chemical-bond">
                        </div>
                        
                    </slot>
                {{folder}}
                </div>
            </b-col>
            <b-col cols="6" >
                <div class="right-col" style="margin-right: 2vmin;">
                    <slot name="right-icon">
                        <div class="dollar">
                        </div>
                    </slot>
                {{reward}}
                </div>
            </b-col>
        </b-row>
        <b-row class="mb-2">
            <b-col cols="6" >
                <div class="left-col" >
                    <slot name="left-icon">
                        <div class="user">
                        </div>
                    </slot>
                {{username}}
                </div>
            </b-col>
            <b-col cols="6" >
                <div class="right-col" style="margin-right: 2vmin;">
                    <slot name="right-icon">
                        <div class="people" >
                        </div>
                    </slot>
                {{num_cleared}}
                </div>
            </b-col>
        </b-row>
        </div>
        <div class="button-position">
            <b-button variant="primary"  class="puzzle-card-button" @click="$emit('play')">PLAY</b-button>
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
        },
        title:{
            type: String
        },
        folder:{
            type: String
        },
        reward:{
            type: String
        },
        username:{
            type: String
        },
        user_pfp:{
            type: String
        },
        num_cleared:{
            type: String
        },
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
    border: solid;
    border-color: #21508C;
}

.puzzle-card-locked {
    opacity: 0.5;
}


.puzzle-card-image {
    width: 80%;
    height: 30vmin;
    object-fit: contain;
    position: relative;
    top: -2vmin;
    z-index: -1;
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
.puzzle-card-title {
    white-space: normal;
    margin-left: 2vmin;
    margin-right: 2vmin;
    font-size: 2vmin;
    height: 6vmin;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;
    top: 3vmin;
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
.row-position{
    position: relative;
    top: -9vmin;
}
.button-position{
    position: relative;
    top: -9vmin;
}
.status-text{
    margin-top: .08vmin;
    margin-left: 1vmin;
}
.chemical-bond{
    background: url('../assets/chemical_bond.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2vmin;
    width: 2vmin;
    margin-left: 2vmin;
    margin-right: 2vmin;
}
.dollar{
    background: url('../assets/dollar.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2vmin;
    width: 2vmin;
    margin-left: 2vmin;
    margin-right: 2vmin;
}
.noun-puzzle{
    background: url('../assets/noun_puzzle.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2vmin;
    width: 2vmin;
    margin-left: 2vmin;
    margin-right: 2vmin;
}
.people{
    background: url('../assets/people.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2vmin;
    width: 2vmin;
    margin-left: 2vmin;
    margin-right: 2vmin;
}
.user{
    background: url('../assets/user.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2vmin;
    width: 2vmin;
    margin-left: 2vmin;
    margin-right: 2vmin;
}
.icon {
    width: 19vmin;
    margin-right: 5vmin;
}
.left-col,
  .right-col {
    font-size: 2vmin;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
.right-col {
    justify-content: flex-end;
  }
</style>
