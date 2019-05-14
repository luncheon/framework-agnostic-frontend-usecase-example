import Vue from 'vue'
import Worksheet from './Worksheet.vue'
import '../../common/styles.css'

Vue.config.productionTip = false

new Worksheet({ el: document.body.appendChild(document.createElement('div')) })
