<template>
    <BasePuzzleListPage :forQuest="true" :quest="achievement">
        <template v-slot:left-block>
            <img :src="resolveUrl(achievement.image)" :alt="achievement.title" style="object-fit: contain; width: 100%; height: 100%; max-height: 40vh;"/>
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

<style lang="scss" scoped></style>
