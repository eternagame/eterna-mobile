<template>
    <BasePuzzleListPage :forQuest="true" :quest="achievement" :collection="collection?.nid" v-if="!$store.state.isLoading">
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

import { Achievement, Action, CollectionList } from '../store';


export default Vue.extend({
    async mounted() {
        await Promise.all([
            this.$store.dispatch(Action.GET_QUEST_ACHIEVEMENT_ROADMAP),
            this.$store.dispatch(Action.GET_QUESTS)
        ]);
    },
    components: {
        BasePuzzleListPage
    },
    computed: {
        achievement(): Achievement {
            return (this.$store.state.quest_roadmap as Achievement[] || [])?.find(a => a.key == this.$route.params.id && a.level == +this.$route.params.level)!;
        },
        collection() {
            const achievement = this.achievement as Achievement;
            return (this.$store.state.quests as CollectionList)?.collections.find((collection) => collection.achievement === achievement.key)
        },
        description(): string{
            return DOMPurify.sanitize(this.collection?.desc || this.achievement.desc);
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
