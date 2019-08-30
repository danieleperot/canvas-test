import Vue from 'vue'
import Dashboard from '@/components/Dashboard'
import ControlsSection from '@/components/ControlsSection'

export default () => {
  Vue.component('dashboard', Dashboard)
  Vue.component('controls-section', ControlsSection)
}
