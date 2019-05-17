import Vue from 'vue'
import App from './App.vue'
import '../../common/styles.css'

Vue.config.productionTip = false

const importAll = (requireContext: ReturnType<typeof require.context>) => requireContext.keys().forEach(requireContext)

importAll(require.context('./components', false, /\.vue$/))
importAll(require.context('./directives', false, /\.ts$/))

new App({ el: document.body.appendChild(document.createElement('div')) })
