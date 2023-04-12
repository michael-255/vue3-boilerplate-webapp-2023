import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Dialog, Notify, Quasar } from 'quasar'
import router from '@/router'
import App from '@/App.vue'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  // import Quasar plugins and add here
  plugins: {
    Dialog, // doesn't appear to support default settings
    Notify,
  },
  config: {
    dark: true,
    /**
     * Defined app colors.
     * @see https://quasar.dev/style/color-palette
     * @see https://quasar.dev/quasar-utils/color-utils#helper-getpalettecolor
     */
    brand: {
      primary: '#1976d2', // indigo (Primary Brand Color)
      secondary: '#607d8b', // blue-grey (LOG)
      accent: '#673ab7', // deep-purple-6 (DEBUG)
      info: '#0d47a1', // blue-10 (INFO)
      warning: '#ff6f00', // amber-10 (WARN)
      negative: '#C10015', // negative (ERROR)
      positive: '#4caf50', // green
      dark: '#1d1d1d',
      'dark-page': '#121212',
    },
    // notify: {...}, // default set of options for Notify Quasar plugin
    // loading: {...}, // default set of options for Loading Quasar plugin
    // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // // ..and many more (check Installation card on each Quasar component/directive/plugin)
  },
})

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app')
