<template>
    <b-form id="login-container">
        <a class="close-button" @click="back"></a>
        <div class="logo" />
        
        <p style="font-weight: bold">Are you sure you want to delete your account?</p>
        <p>
            We're sorry to hear that you're leaving us! Is there something wrong that we can help with?
            Please get in touch at <a href="mailto:support@eternagame.org">support@eternagame.org</a>.
        </p>
        <p>
            Your account will be deactivated and scheduled to be deleted in 30 days.
            Per our privacy policy found at <a href="https://eternagame.org/terms">https://eternagame.org/terms</a>,
            your identifying information will be removed and your contributions will be anonymized
            (though we cannot retroactively remove names that may have been included in
            scientific publications). If you have used our forum, you will also need to separately
            delete your forum account at <a href="https://forum.eternagame.org/">https://forum.eternagame.org/</a>.
        </p>
        <p>
            Thank you for joining us on our mission to advance science! To confirm you want to delete
            your account, please enter your username and password below and click delete.
        </p>
        
        <b-form-input type="text" size="md" :disabled="isLoading" v-model="username" placeholder="username"></b-form-input>
        <b-form-input type="password" size="md" :disabled="isLoading" v-model="password" placeholder="password"></b-form-input>
        <div class="alert-container">
            <transition name="fade">
                <b-alert :show="showError" variant="danger" dismissable>
                    {{error}}
                </b-alert>
            </transition>
        </div>
        <b-form-group>
            <b-button variant="danger" :disabled="isLoading" size="md" @click="deleteAccount">
                Delete Account
                <b-spinner v-if="isLoading" small />
            </b-button>
        </b-form-group>
        <b-form-group>
            <b-button variant="secondary" :disabled="isLoading" size="md" @click="back">Cancel</b-button>
        </b-form-group>
    </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from '../store';

export default Vue.extend({
    data() {
        return {
            username: '',
            password: '',
            error: '',
            isLoading: false,
            showError: false
        };
    },
    computed: {
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        async deleteAccount() {
            this.error = '';
            this.showError = false;

            if (!this.username) {
                this.error = 'Please enter your username';
                this.showError = true;
                return;
            }

            if (!this.password) {
                this.error = 'Please enter your password';
                this.showError = true;
                return;
            }

            if (this.username !== this.$store.state.username) {
                this.error = 'This is not your current username';
                this.showError = true;
                return;
            }

            this.isLoading = true;

            const { data } = (await this.$http.post('/login/', new URLSearchParams({
                type: 'delete',
                pass: this.password
            }))).data;

            if (data.success) {
                await this.$store.dispatch(Action.LOGOUT);
                await this.$router.push('/');
            } else {
                this.error = data.error;
                this.showError = true;
            }

            this.isLoading = false;
        },
        back() {
            this.$router.back();
        },
    },
});
</script>

<style lang="scss" scoped>
.logo {
    background: url('../assets/logo_eterna.svg') no-repeat center top; /* 170px x 200px */
    height: 15vmin;                   /* text area height */
    margin-bottom: 10vmin;
}

#login-container {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    text-align: center;
    padding-top: 10vh !important;
    padding: 25px;
}
#login-container::-webkit-scrollbar {
    display: none;
}

p {
    text-align: left;
}

.form-control {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}

.alert-container {
    width: 80vw;
    max-width: 300px;
    margin: 0 auto;
}

.close-button {
    position: fixed;
    right: 3vmin;
    top: 3vmin;
    margin: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-right, 0);
}
</style>
