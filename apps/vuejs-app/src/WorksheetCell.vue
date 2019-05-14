<template lang="pug">
td(
  :class="{ active }"
  :data-row-index="rowIndex"
  :data-column-index="columnIndex"
)
  input(
    v-if="active"
    :value="content"
    v-autofocus
  )
  template(v-else) {{content}}
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    active: { type: Boolean, required: true },
    rowIndex: { type: Number, required: true },
    columnIndex: { type: Number, required: true },
    content: String,
  },
  directives: {
    autofocus: {
      inserted(el) {
        el.focus()
      },
    },
  },
})
</script>
