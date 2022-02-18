<template>
    <div class="progress-wrapper">
        <div class="base-progress">
            <svg class="base-progress__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-progress__circle">
                <circle class="base-progress__path-elapsed" cx="50" cy="50" r="45" />
                <path
                    id="base-progress-path-remaining"
                    :stroke-dasharray="progress"
                    class="base-progress__path-remaining"
                    d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                    "
                ></path>
                </g>
            </svg>
            <span class="base-progress__label">
                {{ currentProgress }} <br /> /{{ maxLimit }}
            </span>
        </div>
        <p>My Submissions</p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
      return {
        maxScore: 650,
        currentScore: 325,
        fullDashArray: 283,
        progress: `0 283`
      }
    },
    props: {
        maxLimit: {
            type: Number
        },
        currentProgress: {
            type: Number
        },
    },
    methods: {
        setProgress() {
            this.progress = `${this.fullDashArray * this.currentProgress / this.maxLimit} ${this.fullDashArray}`;
        }
    },
    mounted: function() {
        this.setProgress();
    }
})
</script>

<style lang="scss" scoped>
    .base-progress {
    width: 15vmin;
    height: 15vmin;
    position: relative;
    }
    .base-progress__circle {
    fill: none;
    stroke: none;
    }
    .base-progress__path-elapsed {
    stroke: #515b68cb;
    stroke-width: 10px;
    }
    .base-progress__path-remaining {
    stroke-width: 10px;
    stroke-linecap: round;
    stroke: #FAC244;
    transition: all 1s linear;
    transform-origin: center;
    transform: rotate(-90deg) scaleX(-1);
    }
    .base-progress__label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2vmin;
    font-weight: 700;
    }
    .progress-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        p {
            font-size: 2vmin;
            margin: 1.5vmin 0 0;
            font-weight: 700;
        }
    }
</style>