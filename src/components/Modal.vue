<template>
    <b-modal
    id="id"
    ref="modal"
    size="xl"
    header-border-variant="primary"
    hide-header
    hide-footer
    >
    <div class="readmore-scroll">
        <b-img  class="puzzle-card-image" :src="imgSrc" />
        <div style="padding: 2vmin;">
                <div class="modal-title">
                        {{title}}
                </div>
                <div  style="font-size: 2vmin;" v-html="text">
                </div>
        </div>
    </div>
</b-modal>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        title: {
            type: String,
            default: ""
        },
        id: {
            type: String,
        },
        imgSrc: {
            type: String,
            default: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png'
        },
        text: {
            type: String,
        }
    },
});
</script>

<style lang="scss">
#readmore-scroll {
    white-space: nowrap;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-right: calc(50% - 22.5vmin);
    padding-left: calc(50% - 22.5vmin);
    margin-top: 0vmin;
    margin-bottom: 6vmin;
    max-width: unset;
}

#readmore-scroll::-webkit-scrollbar {
    display: none;
}

.modal-title{
    width: 100%;
    font-size: 6vmin;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    height: 40vmin;
    top: -1vmin;
}
.modal-body{
    padding: 0vmin;
}
.modal-header {
  display:none;
}
.puzzle-card-image {
    width: 100%;
    height: 40vmin;
    object-fit: contain;
    position: relative;
    top: -2vmin;
}
</style>
