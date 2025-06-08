import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import DataTable from './components/DataTable.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Make bootstrap available globally
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

const app = createApp(App)
const pinia = createPinia()

app.component('DataTable', DataTable)
app.use(router)
app.use(pinia)
app.mount('#app')
