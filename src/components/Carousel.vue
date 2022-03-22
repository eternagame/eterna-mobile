<template>
    <div class="carousel-wrapper">
        <div class="control">
            <div class="arrow_prev" v-on:click="prev"/>
        </div>
        <div style="width: calc(100% - 132px) !important;">
            <b-carousel
                id="carousel-fade"
                style="text-shadow: 0px 0px 2px #000"
                indicators
                img-height="366"
                ref="myCarousel"
                v-if="!isLoading"
            >
                <b-carousel-slide v-for="lab in labSlideData" :key="lab.nid">
                    <template #default>
                        <div class="slide-content">
                            <div class="info">
                                <h2>{{ lab.carousel_title }}</h2>
                                <h3>{{ lab.carousel_subtitle || lab.title }}</h3>
                                <router-link :to="`/labs/${lab.nid}`" class="route-btn">Enter Lab</router-link>
                            </div>
                            <div class="status">
                                <div class="mr-4" v-if="lab.project_closes && lab.project_closes * 1000 > Date.now()">
                                    <p class="text"><strong>{{ lab.designs_to_be_synthesized }} designs</strong> will be selected for <br /> synthesis in:</p>
                                    <flip-countdown :deadline="closesDateFormat(lab)"></flip-countdown>
                                </div>
                                <Progress :maxLimit="lab.max_designs" :currentProgress="lab.total_submitted_solutions_of_user" />
                            </div>
                        </div>
                    </template>
                    <template #img>
                        <div class="img-overlay"></div>
                        <img
                            class="d-block img-fluid w-100"
                            :src="lab.banner_image"
                            alt="image slot"
                        >
                    </template>
                </b-carousel-slide>
                <b-carousel-slide v-if="potw">
                    <template #default>
                        <div class="slide-content">
                            <div class="info">
                                <h2>Puzzle of the Week</h2>
                                <h3>{{ potw.title }}</h3>
                                <router-link :to="`/puzzles/${potw.nid}`" class="route-btn">Solve Now</router-link>
                            </div>
                        </div>
                    </template>
                    <template #img>
                        <div class="img-overlay"></div>
                        <img class="image" :src="`https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${potw.nid}.svg`" :alt="potw.title">
                        <img
                            class="d-block img-fluid w-100"
                            src="https://eternagame.org/img/hero-sunburst.d2ff31bb.png"
                            alt="image slot"
                        >
                    </template>
                </b-carousel-slide>
            </b-carousel>
            <div v-else>
                <b-spinner label="Spinning"></b-spinner>
            </div>
        </div>
        <div class="control">
            <div class="arrow_next" v-on:click="next"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FlipCountdown from 'vue2-flip-countdown';
import Progress from './Progress.vue';
import {LabData, PuzzleData} from '../store'

export default Vue.extend({
    data() {
        return {
            slide: 0,
            potw: <PuzzleData | null>null,
            labSlideData: <LabData[]>[],
            isLoading: true
        }
    },
    async mounted() {
        try {
            const res = await Promise.all([
                this.$http.get(`${process.env.APP_SERVER_URL}/get/?type=side_project_roadmap`),
                this.$http.get(`${process.env.APP_SERVER_URL}/get/?type=carousel`),
                this.$http.get(`${process.env.APP_SERVER_URL}/get/?type=puzzle_of_the_week`),
            ]);
            const carouselBody = await res[1].data;
            const puzzleBody = await res[2].data;
            this.labSlideData = carouselBody.data.labs;
            this.potw = puzzleBody.data;
            this.isLoading = false;
        } catch(e) {
            console.log('ERROR', e);
        }
    },
    methods: {
        prev() {
            (this.$refs.myCarousel as Element & {prev(): void}).prev()
        },
        next() {
            (this.$refs.myCarousel as Element & {next(): void}).next()
        },
        closesDateFormat(lab: LabData) {
            if (!lab.project_closes) return null;
            const d = new Date(lab.project_closes * 1000);
            console.log(`${[d.getFullYear(), d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`, d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`].join('-')} ${[
                d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`,
                d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`,
                d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`,
            ].join(':')}`);
            return `${[d.getFullYear(), d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`, d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`].join('-')} ${[
                d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`,
                d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`,
                d.getSeconds() > 9 ? d.getSeconds() : `0${d.getSeconds()}`,
            ].join(':')}`;
        },
    },
    components: {
        FlipCountdown,
        Progress
    }
});
</script>

<style lang="scss">
.carousel-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
}
.carousel-caption {
    right: 5%;
    left: 5%;
}
.slide-content {
    display: flex;
    align-items: flex-end;
    position: relative;
    .info {
        width: 50%;
        text-align: left;
        h2 {
            font-size: 4vmin;
        }
        h3 {
            font-size: 2.5vmin;
            text-transform: uppercase;
        }
        p {
            font-size: 2vmin;
            margin: 1vmin 0 0;
        }
        .route-btn {
            color: #fff;
            background-color: #53b64e;
            font-size: 2.5vmin;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 6px;
            margin-top: 1vmin;
            display: inline-block;
            text-shadow: none;
            transition: background-color .3s ease;
            &:hover {
                text-decoration: none;
                background-color: #3d8e39;
            }
        }
    }
    .status {
        margin-left: auto;
        display: flex;
        align-items: flex-end;
        .text {
            margin-bottom: 1vmin;
            font-size: 2vmin;
        }
    }
    
    .container.flip-clock {
        padding: 0;
        .flip-clock__piece{
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            .flip-clock__slot {
                font-size: 2vmin;
            }
        }
        .flip-clock__card.flip-card {
            font-size: 3vmin;
            & > b {
                color: #fff;
                &::before {
                    color: inherit;
                }
            }
        }
    }
}

.img-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    opacity: .3;
}

.carousel-item {
    position: relative;
    height: calc(64vh - 15px);
    .image {
        position: absolute;
        right: -2vmin;
        top: 3vmin;
        height: 90%;
        width: 50%;
        object-fit: contain;
    }
}

.carousel-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.control {
    flex: 0 0 66px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.arrow_prev {
    width: 25px;
    height: 25px;
    background-image: url("../assets/slides/back.svg");
    cursor: pointer;
}
.arrow_next {
    width: 25px;
    height: 25px;
    background-image: url("../assets/slides/forward.svg");
    cursor: pointer;
}
</style>