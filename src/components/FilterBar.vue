<template>
  <section class="filter-bar">
    <p>Filters:</p>
    <b-checkbox-group 
      v-model="selected" 
      :options="filters" 
      @input="onCheck" 
      size="sm"
      class="filter-checkboxes"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';

interface Filter {
  value: string;
  text: string;
}

export default Vue.extend({
  props: {
    filters: Array,
  },
  data() {
    return {
      paramName: "filters",
      selected: [],
    }
  },
  methods: {
    onCheck() {
      this.$router.replace({ name: this.$route.name!, query: this.getQuery() });
      this.$emit('filter');
    },
    getQuery() {
      const query = { ...this.$route.query };
      if (this.selected.length) {
        query[this.paramName] = this.selected.join(',');
      } else {
        delete query[this.paramName];
      }
      return query;
    }
  }
})
</script>

<style lang="scss" scoped>
  .filter-bar {
    display: flex;
    padding-left: 15px;
    padding-top: 3vmin;
    width: 100%;

    p {
      font-weight: 600;
      margin-bottom: 0;
      margin-right: 12px;
    }
  }
  
  .filter-checkboxes {
    overflow: auto;
    white-space: nowrap;
  }

  .filter-checkboxes ::v-deep .custom-control-inline {
    display: inline;
    white-space: nowrap;
  }
</style>