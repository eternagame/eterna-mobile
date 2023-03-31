<template>
  <header class="app-header">
    <b-img class="header-logo" :src="logoSourcePng" />
    <div v-if="loggedIn" class="account-dropdown">
      <b-dropdown right variant="link" toggle-class="text-decoration-none header-button menu-button" menu-class="header-button" no-caret>
        <template #button-content>
            <b style="line-height:6vmin;margin-right:2vmin;vertical-align:bottom;">{{ username }}</b>
            <div class="header-icon-people" />
        </template>
        <b-dropdown-item to="/profile">Profile</b-dropdown-item>
        <b-dropdown-item to="/settings">Settings</b-dropdown-item>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-else class="login-buttons">
      <b-button class="header-button" variant="primary" style="margin-right:3vmin" to="/login">Log in</b-button>
      <b-button class="header-button" variant="secondary" to="/register">Register</b-button>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from '../store';

export default Vue.extend({
  props: {
  },
  data() {
    return {
      logoSourcePng: require('../assets/logo_eterna.svg'),
    }
  },
  computed: {
    loggedIn(): boolean {
      return this.$store.state.loggedIn;
    },
    username(): string {
      return this.$store.state.username;
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch(Action.LOGOUT);
      await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
      await this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid});
      this.$router.replace('/');
    },
  }
})
</script>

<style lang="scss" scoped>
  ::v-deep img {
      -webkit-user-drag: none;
  }
  
  .app-header {
    height: 18vh;
    width: 100%;
    padding: 3vmin;
    display: flex;
    justify-content: space-between;
  }

  ::v-deep .menu-button:focus {
    background-color: transparent;
    color: var(--white);
  }

  .header-button {
    font-size: 1.5vw;
  }

  .header-icon-people {
    background-image: url('../assets/DefaultIcon.svg');
    background-position: center top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 6vmin;
    display: inline-block;
    vertical-align: middle;
  }

  .header-logo {
    max-width: 100%;
    height: 100%;
  }
</style>