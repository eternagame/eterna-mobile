<template>
    <b-container id="reset-password-container">
        <a class="close-button" @click="back"></a>
        <h3>Reset password</h3>
        <p>We'll send you an email with a link to reset your password</p>
        <b-form>
            <b-form-input type="email" size="md" v-model="email" placeholder="email"></b-form-input>
            <b-btn variant="primary" size="md" @click="doReset">Send Reset Email</b-btn>
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
export default Vue.extend({
    data() {
        return {
            email: '',
            error: <string | null>null,
            showError: false,
        };
    },
    methods: {
        async doReset() {
            if (this.email.length > 0) {
                const params = new URLSearchParams({
                    type: 'sendreset',
                    resetID: this.email,
                    captchaResponse: 'et3rn4lP4Ss',
                });
                const {data} = (await this.$http.post('/login/', params)).data;
                if (data.success) {
                    this.$router.replace('puzzles');
                } else {
                    console.error('Error:', data.error);
                    this.error = data.error;
                    this.showError = true;
                }
            }
        },
        back() {
            this.$router.replace('puzzles');
        },
    },
})
</script>

<style lang="scss" scoped>
#reset-password-container {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    text-align: center;
    padding-top: 25vh !important;
}
#reset-password-container::-webkit-scrollbar {
    display: none;
}

.form-control {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}

.alert-container {
    padding-top: 10px;
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
