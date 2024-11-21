import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Layout from './components/Layout.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@progress/kendo-theme-default/dist/all.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
