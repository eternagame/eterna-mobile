<template>
    <b-button :class="{'puzzle-card-locked': locked}" class="puzzle-card-container" @click="goToPuzzle">
        <img v-if="cleared" src="../assets/noun_checkmark_lg.png" alt="Completed" class="puzzle-card-icon-checkmark" />
        <div v-if="!playable" class="puzzle-card-title">
            {{title}}
        </div>
        <b-img class="puzzle-card-thumbnail" :src="imgSrc" />
        <div v-if="locked" class="puzzle-card-icon-lock" />
        <div v-if="!playable" class="row-position">
            <div class="meta-row meta-gameplay">
                <div class="meta-tag meta-engine">
                    <slot name="engine-icon">
                        <div class="chemical-bond"></div>
                    </slot>
                    {{folder}}
                </div>
                <div class="meta-tag meta-puzzleFeatures">
                    <div v-if="is3d" class="icon-3d" title="3D puzzle">3D</div>
                    <div v-if="stateCount" class="icon-multistate"></div>
                    <StateCounter v-if="+stateCount > 1" :value="stateCount" :title="`${stateCount} state switch`"/>
                </div>  
            </div>
            <div class="meta-row">
                <div class="meta-tag meta-user">
                    <template v-if="madeByPlayer">
                        <slot name="user-icon">
                            <div class="user"></div>
                        </slot>
                        {{username}}
                    </template>
                </div>
                <div class="meta-tag meta-reward">
                    <slot name="reward-icon">
                        <div class="dollar"></div>
                    </slot>
                    {{reward ? reward : "-"}}
                </div>
                <div class="meta-tag meta-cleared">
                    <slot name="cleared-icon">
                        <div class="people"></div>
                    </slot>
                    {{num_cleared ? num_cleared : "0"}}
                </div>
            </div>
        </div>
        <div v-if="playable && !locked" class="button-position">
            <b-button variant="primary"  class="puzzle-card-button" @click="$emit('play')">Play Now</b-button>
        </div>
    </b-button>
</template>

<script lang="ts">
import Vue from 'vue'
import StateCounter from './StateCounter.vue'

export default Vue.component('puzzle-card', {
    props: {
        playable: {
            type: Boolean,
            default: false
        },
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
        id: {
            type: String
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
        cleared:{
            type: Boolean
        },
        is3d:{
            type: Boolean
        },
        stateCount:{
            type: String
        },
        madeByPlayer: {
            type: Boolean,
            default: true
        },
        locked: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goToPuzzle: function() {
            if(!this.playable) {
                this.$router.push(`/puzzles/${this.id}`);
            }
        }
    },
    components: {
        StateCounter
    }
})
</script>

<style lang="scss" scoped>
::v-deep img {
    -webkit-user-drag: none;
}

.puzzle-card-container {
    position: relative;
    width: 45vmin;
    height: 45vmin;
    display: inline-block;
    border-radius: 2vmin;
    background-color: #008cff15;
    scroll-snap-align: center;
    text-align: center;
    margin-top: 2.5vmin;
    margin-bottom: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
    padding: 0;
    border: solid;
    border-color: #21508C;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    transition: transform 0.2s;
}

.puzzle-card-locked {
    opacity: 0.5;
}


.puzzle-card-thumbnail {
    height: 60%;
    max-width: 100%;
    object-fit: contain;
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
    white-space: nowrap;
    padding: 0 8px;
    font-size: 12px;
    height: 20%;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 4px 8px;
    margin: 0px;
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
    position: absolute;
    right: 1vmin;
    top: 1vmin;
    width: 0.8 * 4.9vmin;
    height: 0.8 * 3.7vmin;
}
.row-position{
    position: relative;
    width: 100%;
    margin: 4px;
    height: 20%;
}
.button-position{
    width: 100%;
}

.chemical-bond{
    background: url('../assets/chemical_bond.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2.5vmin;
    width: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
}
.dollar{
    background: url('../assets/dollar.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2.5vmin;
    width: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
}
.noun-puzzle{
    background: url('../assets/noun_puzzle.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2.5vmin;
    width: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
}
.people{
    background: url('../assets/people.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2.5vmin;
    width: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
}
.user{
    background: url('../assets/user.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    height: 2.5vmin;
    width: 2.5vmin;
    margin-left: 1vmin;
    margin-right: 1vmin;
}
.icon {
    width: 19vmin;
    margin-right: 5vmin;
}
.left-col,
  .right-col {
    font-size: 2.5vmin;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
.right-col {
    justify-content: flex-end;
  }
.meta-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1px;
}
.meta-tag {
    display: flex;
    font-size: 10px;
    align-items: center;
}
.icon-3d {
    background-color: var(--med-blue);
    padding: 1px 3px;
    border-radius: 2px;
    margin: 0 5px;
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
</style>
