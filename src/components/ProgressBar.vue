<template>
    <b-row class="justify-content-sm-center flex-nowrap"> <!-- justify-content-sm-center -->
        <b-col class="no-padding" v-for="n in 19" :key="n">
            <div v-if="n % 2 != 0" class="circle">{{ (n + 1) / 2 }}</div>
            <div v-else class="rectangle" />
        </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>

<style lang="scss" scoped>
.circle {
    height: 25px;
    width: 25px;
    background-color: rgb(211, 211, 211);
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0px 0px 5px 1px #50b2dc; //TODO(westberg): put this property in a common class, i.e. .highlight
}

.rectangle {
    height: 10px;
    width: 35px;
    background-color: rgb(211, 211, 211);
    display: inline-block;
    box-shadow: 0px 0px 5px 1px #50b2dc;
}

.no-padding {
   padding: 0 !important;
   margin: 0 !important;
}
</style>