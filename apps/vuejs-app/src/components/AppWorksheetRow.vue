<template lang="pug">
tr
  th {{rowIndex}}
  AppWorksheetCell(
    v-for="(_, columnIndex) in maxColumnIndex + 1"
    :key="columnIndex"
    :rowIndex="rowIndex"
    :columnIndex="columnIndex"
    :active="columnIndex === activeCellIndex"
    :content="row && row[columnIndex]"
  )
</template>

<script lang="ts">
import { filename } from 'paths.macro'
import Vue from 'vue'

export default Vue.component(filename, {
  props: {
    rowIndex: { type: Number, required: true },
    row: { type: Array },
    activeCellIndex: { type: Number },
    maxColumnIndex: { type: Number, required: true },
  },
})
</script>
