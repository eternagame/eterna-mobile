<template>
    <BasePuzzleListPage :forQuest="false">
        <template v-slot:left-block>
            <p><strong>Puzzles</strong></p>
            <p>Browse and solve the latest player-created puzzles, from simple shapes to complex and creative designs. New puzzles are added by the community every day.</p>
        </template>
    </BasePuzzleListPage>
</template>

<script lang="ts">
import Vue from 'vue'
import BasePuzzleListPage from '../components/BasePuzzleListPage.vue'

export default Vue.extend({
    components: {
        BasePuzzleListPage
    }
});
</script>

<style lang="scss" scoped></style>
