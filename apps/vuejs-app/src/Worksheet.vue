<template lang="pug">
table.worksheet
  thead
    tr
      th
      th(
        v-for="(_, columnIndex) in worksheet.maxCellAddress.columnIndex + 1"
        :key="columnIndex"
      ) {{columnIndex}}
  tbody(
    @click="worksheetOperations.setActiveCellAddress(+$event.target.dataset.rowIndex, +$event.target.dataset.columnIndex)"
    @input="worksheetOperations.setActiveCellContent($event.target.value)"
  )
    tr(
      v-for="(_, rowIndex) in worksheet.maxCellAddress.rowIndex + 1"
      :key="rowIndex"
    )
      th {{rowIndex}}
      WorksheetCell(
        v-for="(_, columnIndex) in worksheet.maxCellAddress.columnIndex + 1"
        :key="columnIndex"
        :rowIndex="rowIndex"
        :columnIndex="columnIndex"
        :active="rowIndex === worksheet.activeCellAddress.rowIndex && columnIndex === worksheet.activeCellAddress.columnIndex"
        :content="worksheet.cellContents[rowIndex] && worksheet.cellContents[rowIndex][columnIndex]"
      )
</template>

<script lang="ts">
import Vue from 'vue'
import { WorksheetOperations } from '../../../usecase'
import createWorksheet from '../../common/createWorksheet'
import createWorksheetKeyEventHandler from '../../common/createWorksheetKeyEventHandler'
import WorksheetCell from './WorksheetCell.vue'

// Vue.js 2.x は配列要素の変更を検知できないので、現状の WorksheetOperations#setActiveCellContent() の実装では本当はダメです。
// ただし現状は入力確定時に必ずアクティブセルも合わせて変更されるために正しく動いているように見えてしまいます。
// Vue.js 3.x では配列要素の変更も検知できるようになるはずなので、このサンプルでは時間が解決することを信じて放置します。
export default Vue.extend({
  components: { WorksheetCell },
  data() {
    const worksheet = Vue.observable(createWorksheet())
    const worksheetOperations = new WorksheetOperations(
      mutate => mutate(worksheet)
    )
    const worksheetKeyEventHandler = createWorksheetKeyEventHandler(worksheetOperations)
    return { worksheet, worksheetOperations, worksheetKeyEventHandler }
  },
  mounted() {
    window.addEventListener('keydown', this.worksheetKeyEventHandler)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.worksheetKeyEventHandler)
  },
})
</script>
