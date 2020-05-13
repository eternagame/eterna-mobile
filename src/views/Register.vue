<template>
    <b-container id="register-container">
        <b-button class="back-button" @click="back">Back</b-button>
        <h3>Create a New Account</h3>
        <p>Register now to save your progress, engage in our community chat, and contribute solutions to science.</p>
        <b-form>
            <b-form-input type="text" v-model="username" placeholder="username" required></b-form-input>
            <b-form-input type="email" v-model="email" placeholder="email" required></b-form-input>
            <b-form-input type="password" v-model="password" placeholder="password" required></b-form-input>
            <b-form-input type="password" v-model="passwordConfirm" placeholder="re-enter password" required></b-form-input>
            <vue-recaptcha
                sitekey="6LcFwUsUAAAAAOQ9szhauSNv2bJuBOUtw_pGrRnd"
                :loadRecaptchaScript="true"
                @verify="captchaResponse = $event"
                class="captcha"
            />
            <b-btn variant="primary" :disabled="isLoading" @click="doRegister">Create Account</b-btn>
            <b-form-group>
                <a href="https://eternagame.org/web/news/15121/" target="_blank">Terms &amp; Conditions</a>
            </b-form-group>
        </b-form>
        <div class="alert-container">
            <b-alert v-model="showError" variant="danger" dismissable>
                {{error}}
            </b-alert>
        </div>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import VueRecaptcha from 'vue-recaptcha';
import { Action } from '../store';
export default Vue.extend({
    components: {
        VueRecaptcha,
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            captchaResponse: '',
            error: <string | null>null,
            showError: false,
        };
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        async doRegister() {
            if (this.username.length > 0 && this.email.length > 0 && this.password.length > 0 && this.password === this.passwordConfirm && this.captchaResponse.length > 0) {
                const params = new URLSearchParams({
                    type: 'create',
                    name: this.username,
                    pass: this.password,
                    mail: this.email,
                    captcha_response: this.captchaResponse,
                });
                const {data} = (await this.$http.post('/login/', params)).data;
                if (data.success) {
                    await this.doLogin();
                } else {
                    console.error('Error:', data.error);
                    this.error = data.error;
                    this.showError = true;
                }
            }
        },
        async doLogin() {
            if (this.username.length > 0 && this.password.length > 0) {
                const data = await this.$store.dispatch(Action.LOGIN, {username: this.username, password: this.password});
                if (data.error) {
                    console.error('Error:', data.error);
                    this.error = data.error;
                    this.showError = true;
                }
                if (this.loggedIn) {
                    this.$router.replace('puzzles');
                }
            }
        },
        back() {
            this.$router.back();
        },
    },
})
</script>

<style lang="scss" scoped>
#register-container {
    width: 100vw;
    text-align: center;
    padding-top: 10vh !important;
}

.form-control {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}

.captcha {
    margin: 0 auto;
    margin-bottom: 10px;
}

.alert-container {
    padding-top: 10px;
    width: 80vw;
    max-width: 300px;
    margin: 0 auto;
}

.back-button {
    position: absolute;
    left: 10px;
    top: 10px;
}
</style>
