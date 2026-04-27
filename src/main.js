import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import router from './router/index.js'
import App from './App.vue'

// ── Configuración de Vuetify ──────────────────────────────────
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#185FA5',   // azul barra superior
          success: '#3B6D11',   // verde mensajes
          warning: '#854F0B',   // ámbar notas
        },
      },
    },
  },
})

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')