<template>
    <BasePuzzleListPage :forQuest="true" :quest="achievement">
        <template v-slot:left-block>
            <img :src="resolveUrl(achievement.image)" :alt="achievement.title" style="object-fit: contain; width: 100%; height: 100%; max-height: 60%;"/>
            <p v-html="description"></p>
        </template>
    </BasePuzzleListPage>
</template>

<script lang="ts">
import Vue from 'vue'
import DOMPurify from 'dompurify'
import BasePuzzleListPage from '../components/BasePuzzleListPage.vue'

import { Achievement, Action } from '../store';


export default Vue.extend({
    async mounted() {
        await this.$store.dispatch(Action.GET_QUEST_ACHIEVEMENT_ROADMAP);
    },
    components: {
        BasePuzzleListPage
    },
    computed: {
        achievement(): Achievement {
            return (this.$store.state.quest_roadmap as Achievement[] || []).find(a => a.key == this.$route.params.id && a.level == +this.$route.params.level)!;
        },
        description(): string{
            return DOMPurify.sanitize(this.achievement.desc);
        }
    },
    methods: {
        resolveUrl(path: string) {
            if (path.startsWith('http')) return path;
            if (path.startsWith('/')) return process.env.APP_SERVER_URL + path;
            return process.env.APP_SERVER_URL + '/' + path;
        }
    }
});
</script>

<style lang="scss" scoped>
.loading-spinner {
    position: absolute;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.puzzle-view-container {
    padding: 0;
    margin: 0;
    text-align: center;
    touch-action: none;
}

#puzzle-view-header {
    height: 18vh !important;
    margin-bottom: 15px;
    padding-top: 0 !important;
    margin-left: 3vmin;
    margin-right: 3vmin;
}

#puzzle-scroll {
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-right: calc(50% - 22.5vmin);
    padding-left: 25px;
    margin-top: 0vmin;
    max-width: unset;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}


#puzzle-view-footer {
    height: 18vh !important;
    display: flex;
    align-items: center;
    margin-left: 3vmin;
    margin-right: 3vmin;
}

#puzzle-card-wrapper {
    position: relative;
    display: inline-block;
    scroll-margin: 0 50vw;
}

.puzzle-card-container {
    transition: transform 0.2s;
}

.puzzle-view-button {
    font-size: 1.5vw;
}

.puzzle-view-chat-button {
    background: url('../assets/Chat.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 9vmin;
    height: 8vmin;
}
.puzzle-view-about-button {
    background: url('../assets/noun_info.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 6vmin;
    height: 6vmin;
}

.puzzle-view-icon-people {
    background-image: url('../assets/DefaultIcon.svg');
    background-position: center top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 6vmin;
    display: inline-block;
    vertical-align: middle;
}

.puzzle-card-popover {
    font-size: 1.5vw;
    max-width: 300px;
}

.finish-card {
    position: absolute;
    top: 0;
    display: inline-flex;
    width: 30vw;
    height: 45vmin;
    margin: 3vmin 1vmin 3vmin 1vmin;
    text-align: center;
    white-space: normal;
    vertical-align: middle;

    > div {
        margin: auto;

        p {
            font-size: 1.5vw;
        }
        strong {
            font-size: larger;
        }
    }
}

.left-aligned {
    text-align: left;
}

.chat {
    text-align: left;
    box-sizing: content-box;
    width: 230px;
    height: 340px;
    position: absolute;
    top: 140px;
    right: 10px;
    border: 1px solid rgba(47, 148, 209, 0.9);
    border-radius: 5px;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    z-index: 1000;

    * {
        box-sizing: content-box;
    }
    button, img {
        padding: 0;
    }
}

@media (max-height: 510px) {
    .chat {
        width: 30%;
        min-width: 230px;
        height: 85%;
        top: 5px;
        right: 5px;
    }
}
.hidden{
  opacity: 0;
}
.header-logo {
    max-width: 100%;
    height: 100%;
}
</style>
