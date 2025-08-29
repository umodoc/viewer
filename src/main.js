import App from './app.vue'
import { useUmoViewer } from './components'
const app = createApp(App)

const options = {}

app.use(useUmoViewer, options)

app.mount('#app')
