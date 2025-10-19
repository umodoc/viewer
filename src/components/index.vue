<template>
  <t-config-provider
    :global-config="{
      classPrefix: 'uv',
    }"
  >
    <div :id="containerId" class="umo-viewer-container">
      <header v-if="options.showHeader" class="umo-viewer-header">
        <layout-header />
      </header>
      <main class="umo-viewer-main">
        <layout-main />
      </main>
      <footer
        v-if="!options.needPassword && state.loaded"
        class="umo-viewer-footer"
      >
        <layout-footer />
      </footer>
      <layout-share />
      <layout-print v-if="state.printing" />
      <layout-about v-if="state.about" />
    </div>
  </t-config-provider>
</template>

<script setup>
import '@/assets/styles/index.less'

import { schemaParse } from '@/components/options.js'

defineOptions({ name: 'UmoViewer' })

const props = defineProps({
  lang: {
    type: String,
    default: 'zh-CN',
  },
  theme: {
    type: String,
    default: 'light',
  },
  mode: {
    type: Array,
    default: () => ['pdf', 'html'],
  },
  title: {
    type: String,
    required: true,
  },
  meta: {
    type: Array,
    default: () => [],
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showAside: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: undefined,
  },
  printable: {
    type: Boolean,
    default: true,
  },
  downloadable: {
    type: Boolean,
    default: true,
  },
  closeable: {
    type: Boolean,
    default: false,
  },
  shareUrl: {
    type: String,
    default: undefined,
  },
  html: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    default: undefined,
  },
  showMultiPage: {
    type: Boolean,
    default: false,
  },
  fitWidth: {
    type: Boolean,
    default: false,
  },
  needPassword: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
    default: undefined,
  },
  onEdit: {
    type: Function,
    default: undefined,
  },
  onValidatePassword: {
    type: Function,
    default: undefined,
  },
})

// 合并defaultOptions和props，并校验
const defaultOptions = inject('defaultOptions', {})
const options = ref({})

// 当 options 变化时，更新 options
watch(
  props,
  () => {
    options.value = schemaParse({ ...defaultOptions, ...props })
  },
  { deep: true, immediate: true },
)

// 容器
const shortId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}
const containerId = `umo-viewer-${shortId()}`
provide('container', `#${containerId}`)

// 将 options 提供给子组件
provide('options', options)

// 维护全局状态
const state = ref({
  loaded: false,
  aside: options.value.mode[0] === 'html' ? 'toc' : 'thumbs',
  view: options.value.mode[0],
  toc: [],
  activeHeading: [],
  activePage: 1,
  zoom: 1,
  page: {},
  pdfDocument: null,
  printing: false,
  sharing: false,
  about: false,
})
provide('state', state)

// 设置语言和主题
const { locale } = useI18n()
const setLocale = (params) => {
  locale.value = params
}
const setTheme = (theme) => {
  if (theme !== 'auto') {
    document.querySelector('html')?.setAttribute('theme-mode', theme)
    return
  }
  const darkScheme = '(prefers-color-scheme: dark)'
  const prefersDarkScheme = window.matchMedia(darkScheme).matches
  setTheme(prefersDarkScheme ? 'dark' : 'light')
  window.matchMedia(darkScheme).addEventListener('change', (e) => {
    setTheme(e.matches ? 'dark' : 'light')
  })
}
onMounted(() => {
  setTheme(options.value.theme)
  setLocale(options.value.lang)
})
</script>

<style lang="less" scoped>
.umo-viewer {
  &-container {
    --td-text-color-brand: var(--uv-primary-color);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  &-header {
    height: var(--uv-header-height);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--uv-border-color);
    background-color: var(--uv-color-white);
    gap: 50px;
  }
  &-main {
    flex: 1;
    display: flex;
    width: 100%;
    overflow: hidden;
    position: relative;
    --td-mask-disabled: var(--uv-container-background);
  }
  &-footer {
    width: 100%;
    border-top: 1px solid var(--uv-border-color);
    background-color: var(--uv-color-white);
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    box-sizing: border-box;
  }
}
</style>
