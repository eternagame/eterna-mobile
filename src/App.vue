<template>
<div id="app">
    <router-link to="/" exact>Home</router-link>
    <router-link to="about">About</router-link>
    <router-link to="game">Game</router-link>
    <router-view />
</div>
</template>

<style lang="scss">
* {
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* make transparent link selection, adjust last value opacity 0 to 1.0 */
}

*:focus {
    outline: none;
}

body {
    -webkit-touch-callout: none;                /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none;             /* prevent webkit from resizing text to fit */
    -webkit-user-select: none;                  /* prevent copy paste, to allow, change 'none' to 'text' */
    background-color: rgb(7, 55, 99);
    color: #FFFFFF;
    font-family: system-ui, -apple-system, -apple-system-font, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 12px;
    height: 100vh;
    margin: 0px;
    padding: 0px;
    /* Padding to avoid the "unsafe" areas behind notches in the screen */
    padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-right, 0px);
    text-transform: uppercase;
    width: 100%;
}

h1 {
    font-size: 24px;
    font-weight: normal;
    margin: 0px;
    overflow: visible;
    padding: 0px;
    text-align: center;
}

.router-link-active {
    color: yellow;
}
</style>
