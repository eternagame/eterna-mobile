<template>
  <section class="settings">
    <HeaderBar></HeaderBar>
      <div class="settings-form">
        <h1>Settings</h1>
        <b-alert variant="success" :show="success">Updated successfully</b-alert>
        <b-alert variant="danger" :show="error !== ''">{{error}}</b-alert>
        <b-row>
          <b-col>
            <b-form-group
              description="All e-mails from the system will be sent to this address. The e-mail address is not made public and will only be used for communication."
              label="Email Address:"
              label-for="email"
              invalid-feedback="Email address is invalid."
            >
              <b-form-input id="email" type="email" v-model="email" trim :state="emailValid"></b-form-input>
            </b-form-group>
            <b-form-group label="Email Notifications For:">
              <b-form-checkbox v-model="notifications" inline>Private Messages</b-form-checkbox>
              <b-form-checkbox v-model="news" inline>News Posts</b-form-checkbox>
            </b-form-group>
            <b-form-group label="Debug Mode" v-if="$store.state.user.debug_access">
              <b-button style="margin: 5px 0;" variant="primary" @click="promptLoadPuzzle">Load puzzle</b-button>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              description=""
              label="Change Your Password:"
              label-for="password"
              valid-feedback="Passwords match."
              invalid-feedback="Passwords do not match."
              :state="passwordValid"
            >
              <b-form-input class="notifications-checkbox" id="password" type="password" v-model="newPassword" placeholder="New Password" trim></b-form-input>
              <b-form-input class="notifications-checkbox" id="confirm-password" type="password" v-model="confirmPassword" placeholder="Confirm Password" trim></b-form-input>
            </b-form-group>
            <b-form-group
              description="Current password must be provided in order to change any profile settings"
              label="Current Password:"
              label-for="current-password"
            >
              <b-form-input class="notifications-checkbox" id="current-password" type="password" v-model="currentPassword" placeholder="Current Password" trim></b-form-input>
            </b-form-group>
          <b-button style="margin: 5px 0;" variant="primary" :disabled="!formValid" @click="update">Update Settings</b-button>
          <b-button style="margin: 5px 0;" variant="danger" @click="$router.push('/delete-account')">Delete Account</b-button>
          </b-col>
        </b-row>
      </div>
    <NavBar>
      <template v-slot:left>
        <button @click="$router.go(-1)" class="back-button">
          <svg viewBox="0 0 24 24" class="feather feather-arrow-left-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 8 8 12 12 16"></polyline>
            <line x1="16" y1="12" x2="8" y2="12"></line>
          </svg>
        </button>
      </template>
      <template v-if="!lab_access" v-slot:center>
        <b-button variant="primary" size="lg" class="nav-button" id="home-btn" @click="$router.push('/')">
          <div class="home-disabled"></div>
          Home
        </b-button>
      </template>
      <template v-slot:right><div></div></template>
    </NavBar>
    <div class="loading-container" v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderBar from '../components/HeaderBar.vue';
import NavBar from '../components/NavBar.vue';

export default Vue.extend({
  components: {
    HeaderBar,
    NavBar
  },
  data() {
    return {
      isLoading: false,
      error: '',
      success: false,
      email: <string | undefined> undefined,
      newPassword: '',
      confirmPassword: '',
      currentPassword: '',
      notifications: false,
      news: false,
    }
  },
  async created() {
    this.isLoading = true;
    await(this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid}));
    if (this.$store.state.user) {
      this.email = this.$store.state.user.mail;
      this.notifications = this.$store.state.user.mail_notification;
      this.news = this.$store.state.user.news_notification;
      this.isLoading = false;
    }
  },
  computed: {
    emailValid(): boolean | null {
      if (this.email === undefined) {
        return null;
      } else {
        return this.validateEmail(this.email);
      }
    },
    passwordValid(): boolean | null {
      if (this.newPassword === '' && this.confirmPassword === '') {
        return null
      }
      return this.newPassword === this.confirmPassword;
    },
    formValid(): boolean {
      if (this.emailValid === null || this.emailValid === false) {
        return false;
      } else if (this.passwordValid === false || this.currentPassword === '') {
        return false;
      } else {
        return true;
      }
    },
    lab_access() {
      return this.$store.state.user.lab_access;
    }
  },
  methods: {
    validateEmail(email: string): boolean {  
      const emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return emailRegEx.test(email.toLowerCase())
    },
    async update() {
      this.isLoading = true;
      this.success = false;
      this.error = '';
      const data = new FormData();
      data.set('pass[current]', this.currentPassword);
      if (this.newPassword && this.newPassword === this.confirmPassword) {
        data.set('pass[pass1]', this.newPassword);
        data.set('pass[pass2]', this.confirmPassword);
      }
      data.set('profile_mail_notification', this.notifications ? 'on' : 'off');
      data.set('profile_news_mail_notification', this.news ? 'on' : 'off');
      data.set('profile_blog_mail_notification', this.news ? 'on' : 'off');
      if (this.email && this.validateEmail(this.email)) {
        data.set('mail', this.email.toLowerCase());
      }
      data.set('type', 'edit');

      try {
        const res = await this.$http.post('/login/', data, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        });
        this.isLoading = false;
        const error = res?.data?.data?.error;
        if (error) throw new Error(error);
        // this.$router.push(`/players/${this.$vxm.user.uid}`);
        this.success = true;
      } catch (e: any) {
        if (e instanceof Error) this.error = e.message;
      }
    },
    promptLoadPuzzle() {
      const id = prompt('Please enter a puzzle ID');
      if (id !== null) this.$router.push(`/game/${id}`);
    }
  },
})
</script>

<style lang="sass" scoped>
.settings {  
  h1 {
    font-size: 1.5rem;
  }
}

.settings-form {
  padding: 0px 32px;
  max-height: 64vh;
  overflow: auto;

  .notifications-checkbox {
    padding-right: 4px;
  }
}

.loading-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
}
</style>