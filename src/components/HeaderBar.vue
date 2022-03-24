<template>
  <header class="app-header">
    <b-img class="header-logo" :src="logoSourcePng" />
    <div v-if="loggedIn" class="account-dropdown">
      <b-dropdown right variant="link" toggle-class="text-decoration-none puzzle-view-button menu-button" menu-class="puzzle-view-button" no-caret>
        <template #button-content>
            <b style="line-height:6vmin;margin-right:2vmin;vertical-align:bottom;">{{ username }}</b>
            <div class="puzzle-view-icon-people" />
        </template>
        <b-dropdown-item to="/profile">Profile</b-dropdown-item>
        <b-dropdown-item to="/settings">Settings</b-dropdown-item>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-else class="login-buttons">
      <b-button class="puzzle-view-button" variant="primary" style="margin-right:3vmin" to="/login">Log in</b-button>
      <b-button class="puzzle-view-button" variant="secondary" to="/register">Register</b-button>
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
      this.$router.replace('/');
      // If logging out while on the homepage, ensure that the homepage properly refreshes with new data
      this.$router.go(0);
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
</style>