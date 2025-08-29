import 'virtual:svg-icons-register'
import UmoViewer from './index.vue'

const useUmoViewer = {
  install: (app, options) => {
    app.provide('defaultOptions', options)
    app.component(UmoViewer.name ?? 'UmoViewer', UmoViewer)
  },
}

export { UmoViewer as default, useUmoViewer }
