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
                <b-carousel-slide>
                    <template #default>
                        <div class="slide-content">
                            <div class="info">
                                <h2>{{ labSlideData.carousel_title }}</h2>
                                <h3>{{ labSlideData.carousel_subtitle || labSlideData.title }}</h3>
                                <router-link :to="`labs/${labSlideData.nid}`" class="route-btn">Enter Lab</router-link>
                            </div>
                            <div class="status">
                                <div class="mr-4" v-if="labSlideData.project_closes && labSlideData.project_closes * 1000 > Date.now()">
                                    <p class="text"><strong>{{ labSlideData.designs_to_be_synthesized }} designs</strong> will be selected for <br /> synthesis in:</p>
                                    <flip-countdown :deadline="closesDateFormat"></flip-countdown>
                                </div>
                                <Progress :maxLimit="labSlideData.max_designs" :currentProgress="labSlideData.total_submitted_solutions_of_user" />
                            </div>
                        </div>
                    </template>
                    <template #img>
                        <div class="img-overlay"></div>
                        <img
                            class="d-block img-fluid w-100"
                            src="https://eternagame.org/sites/default/files/hero-ribosome.jpg"
                            alt="image slot"
                        >
                    </template>
                </b-carousel-slide>
                <b-carousel-slide>
                    <template #default>
                        <div class="slide-content">
                            <div class="info">
                                <h2>Puzzle of the Week</h2>
                                <h3>{{ bestPuzzle.title }}</h3>
                                <router-link :to="`puzzles/${bestPuzzle.nid}`" class="route-btn">Solve Now</router-link>
                            </div>
                        </div>
                    </template>
                    <template #img>
                        <div class="img-overlay"></div>
                        <img class="image" :src="`https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${bestPuzzle.nid}.svg`" :alt="bestPuzzle.title">
                        <img
                            class="d-block img-fluid w-100"
                            src="https://eternagame.org/img/hero-sunburst.d2ff31bb.png"
                            alt="image slot"
                        >
                    </template>
                </b-carousel-slide>
                <b-carousel-slide>
                    <template #default>
                        <div class="slide-content">
                            <div class="info w-75">
                                <h2>10 Years of Discovery</h2>
                                <p>This year we celebrate 10 years of citizen science through Eterna. Together we've synthesized thousands of player-designed molecules, published over 20 academic papers tackling fundamental RNA design questions, and pioneered the open development of RNA medicines. Over the course of the year we'll be rolling out new features and game mechanics as we continue to build the future of Eterna.</p>
                            </div>
                        </div>
                    </template>
                    <template #img>
                        <div class="img-overlay"></div>
                        <img
                            class="d-block img-fluid w-100"
                            src="https://eternagame.org/img/hero-10year.b8ba6993.png"
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

<script>
    import FlipCountdown from 'vue2-flip-countdown';
    import Progress from './Progress.vue';

  export default {
    data() {
      return {
        slide: 0,
        bestPuzzle: null,
        labSlideData: null,
        sliding: null,
        isLoading: true
      }
    },
    mounted: async function() {
        try {
            const res = await Promise.all([
                fetch(`${process.env.APP_SERVER_URL}/get/?type=side_project_roadmap`),
                fetch(`${process.env.APP_SERVER_URL}/get/?type=carousel`),
                fetch(`${process.env.APP_SERVER_URL}/get/?type=puzzle_of_the_week`),
            ]);
            const carouselBody = await res[1].json();
            const puzzleBody = await res[2].json();
            this.labSlideData = carouselBody.data.labs[0];
            this.bestPuzzle = puzzleBody.data;
            this.isLoading = false;
        } catch(e) {
            console.log('ERROR', e);
        }
    },
    methods: {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      },
       prev() {
        this.$refs.myCarousel.prev()
      },
      next() {
        this.$refs.myCarousel.next()
      }
    },
    computed: {
        closesDateFormat() {
            if (!this.labSlideData.project_closes) return null;
            const d = new Date(this.labSlideData.project_closes * 1000);
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
  }
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