<template>
    <b-container id="register-container">
        <a class="close-button" @click="back"></a>
        <h3>Create a New Account</h3>
        <div v-if="!registered">
            <p>Register now to save your progress, engage in our community chat, and contribute solutions to science.</p>
            <b-form>
                <b-form-input type="text" size="md" v-model="username" :disabled="isLoading" placeholder="username" required></b-form-input>
                <b-form-input type="email" size="md" v-model="email" :disabled="isLoading" placeholder="email" required></b-form-input>
                <b-form-input type="password" size="md" v-model="password" :disabled="isLoading" placeholder="password" required></b-form-input>
                <password v-model="password" :strength-meter-only="true" @score=setScore @feedback=setFeedback />
                <b-form-input type="password" size="md" v-model="passwordConfirm" :disabled="isLoading" placeholder="re-enter password" required></b-form-input>
                <div class="alert-container">
                    <b-alert v-model="showError" variant="danger" dismissable>
                        {{error}}
                    </b-alert>
                    <b-alert v-model="showWarning" variant="warning" dismissable>
                        {{warning}}
                    </b-alert>
                </div>
                <b-form-checkbox size="md" v-model="acceptedTerms" :disabled="isLoading" required>
                    I accept the <a href="https://eternagame.org/terms" target="_blank">Terms of Use and Privacy Policy</a>
                </b-form-checkbox>
                <b-form-group>
                    <b-btn variant="primary" :disabled="isLoading" size="md" @click="doRegister">Create Account</b-btn>
                </b-form-group>
            </b-form>
        </div>
        <div v-else>
            A validation link has been sent to your email. Please click on the link to complete your registration.
            <div class="custom-input-group mt-2">
                <b-link size="sm" @click="resend">
                    The validation link will expire after 24 hours. To request a new link please click here.
                </b-link>
            </div>
            <div class="custom-input-group mt-2">
                <b-link size="sm" @click="doLogin">
                    Once you have confirmed your account, click here.
                </b-link>
            </div>
            <div class="alert-container">
                <b-alert v-model="showError" variant="danger" dismissable>
                    {{error}}
                </b-alert>
            </div>
        </div>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action } from '../store';
import Password from 'vue-password-strength-meter';

export default Vue.extend({
    components: {
        Password,
    },
    data() {
        return {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            acceptedTerms: false,
            error: <string | null>null,
            showError: false,
            showWarning: false,
            score: 0,
            warning: '',
            registered: false,
            uid: '',
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
            this.showError = false;
            if (this.username.length > 0 && this.email.length > 0 && this.password.length > 0 && this.password === this.passwordConfirm && this.acceptedTerms) {
                const params = new URLSearchParams({
                    type: 'create',
                    name: this.username,
                    pass: this.password,
                    mail: this.email,
                    captcha_response: 'et3rn4lP4Ss',
                });
                const {data} = (await this.$http.post('/login/', params)).data;
                if (data.success) {
                    this.registered = true;
                    this.uid = data.uid;
                    await this.$store.dispatch(Action.FETCH_CSRF_TOKEN);
                } else {
                    console.error('Error:', data.error);
                    this.error = data.error;
                    this.showError = true;
                }
            }
        },
        async doLogin() {
            this.showError = false;
            if (this.username.length > 0 && this.password.length > 0) {
                const data = await this.$store.dispatch(Action.LOGIN, {username: this.username, password: this.password});
                if (data.error) {
                    console.error('Error:', data.error);
                    this.error = data.error;
                    this.showError = true;
                }
                if (this.loggedIn) {
                    this.$router.replace('/');
                }
            }
        },
        async resend() {
            this.showError = false;
            const params = new URLSearchParams({
                type: 'sendvalidation',
                name: this.username,
                mail: this.email,
                uid: this.uid,
            });
            const {data} = (await this.$http.post('/login/', params)).data;
            if (data.success) {
                this.showError = false;
            } else {
                console.error('Error:', data.error);
                this.error = data.error;
                this.showError = true;
            }
        },
        back() {
            this.$router.back();
        },
        setScore(score: number) {
            this.score = score;
        },
        setFeedback({suggestions, warning}: {suggestions: string[], warning: string}) {
            this.warning = warning;
            this.showWarning = !!warning;
        }
    },
})
</script>

<style lang="scss" scoped>
#register-container {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    text-align: center;
    padding-top: 10vh !important;
}
#register-container::-webkit-scrollbar {
    display: none;
}

p, .form-control, .custom-control, .Password {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}
</style>
