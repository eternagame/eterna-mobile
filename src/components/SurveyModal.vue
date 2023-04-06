<template>
    <b-modal
        ref="modal"
        header-border-variant="primary"
        footer-border-variant="primary"
        centered
        v-model="shown"
    >
        <template #modal-title>
            Who Are We?
        </template>
        <div>
            Did you know the last time we surveyed player demographics was in
            <a href="https://eternagame.org/news/6163840">2015</a>?
            Help us understand who we are by participating in our newly revised survey!
            Results of the Eterna Player Profile Survey will be shared with the Eterna
            community.
            Would you like to participate?
        </div>
        <template #modal-footer>
            <div class="d-flex" style="gap: 10px;">
                <b-button variant="primary" @click="handleYes">Yes</b-button>
                <b-button variant="danger" @click="handleNo">No</b-button>
                <b-button variant="secondary" @click="handleLater">Remind me later</b-button>
            </div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    methods: {
        async handleYes() {
            await this.$http.post(
                '/post/',
                new URLSearchParams({
                    type: 'survey',
                    action: 'update',
                    value: 'DIV_SURVEY_2023_DISMISSED',
                    uid: String(this.$store.state.uid),
                }),
            );
            // To reload user profile
            this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
            // @ts-expect-error Cordova type is missing
            cordova.InAppBrowser.open('https://stanfordmedicine.qualtrics.com/jfe/form/SV_26otHCclO1zC850', '_blank');
        },
        async handleNo() {
            await this.$http.post(
                '/post/',
                new URLSearchParams({
                    type: 'survey',
                    action: 'update',
                    value: 'DIV_SURVEY_2023_DISMISSED',
                    uid: String(this.$store.state.uid),
                }),
            );
            // To reload user profile
            this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
        },
        async handleLater() {
            await this.$http.post(
                '/post/',
                new URLSearchParams({
                    type: 'survey',
                    action: 'update',
                    value: `DIV_SURVEY_2023_DELAY:${Date.now() + (1000 * 60 * 60 * 24)}`,
                    uid: String(this.$store.state.uid),
                }),
            );
            // To reload user profile
            this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
        }
    },
    computed: {
        shown() {
            const entries = this.$store.state.user?.survey?.split(',') ?? [];
            if (entries.includes('DIV_SURVEY_2023_DISMISSED')) return false;
            const delays = entries
                .filter((entry: string) => entry.startsWith('DIV_SURVEY_2023_DELAY:'))
                .map((entry: string) => parseInt(entry.split(':')[1], 10))
                .filter((delay: number) => !Number.isNaN(delay));
            return Math.max(...delays) < Date.now();
        }
    }
});
</script>

<style lang="scss" scoped>
    h3 {
        font-size: 1.5rem;
        font-weight: bold;
    }

    :deep(.modal-footer) {
        margin: 0 auto;
        text-align: center;
    }

    /* Following styles are copied from LoginModal */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.15s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    :deep(.modal-header) {
        -webkit-backdrop-filter: blur(28.125px);
        backdrop-filter: blur(28.125px);
        background-color: #4a90e2;
        padding: 8.4375px;

        .modal-title {
            font-size: 15px;
            font-weight: bold;
            line-height: 1.38;
            margin: 0 auto;
            padding-left: 28.125px;
        }

        .close {
            opacity: 0.5;
            color: var(--white);
            margin-left: 0;

            &:focus {
                outline: none;
            }

            &:hover {
                opacity: 0.5;
            }
        }
    }
</style>
