import { filename } from 'paths.macro'
import Vue from 'vue'

Vue.directive(filename, {
  inserted(el) {
    el.focus()
  },
})
