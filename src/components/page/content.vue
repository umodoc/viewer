<template>
  <article
    class="vu-viewer-content"
    :class="{ 'umo-zoomable-container': !pageError }"
    :style="{
      width: pageError ? '100%' : `${pageSize.width * state.zoom}px`,
      height: pageError ? '100%' : `${pageSize.height * state.zoom}px`,
    }"
  >
    <template v-if="!pageError">
      <div
        ref="pageRef"
        class="umo-zoomable-content"
        :style="{
          transformOrigin: '0 0',
          transform: `scale(${state.zoom})`,
        }"
        v-html="options.content"
      ></div>
      <t-image-viewer
        v-model:visible="imageViewer"
        v-model:index="currentImage"
        :trigger="() => {}"
        :images="images"
        @close="imageViewer = false"
      />
      <modal
        dialog-class-name="uv-file-preview-modal"
        :visible="filePreview"
        :header="false"
        :footer="false"
        width="90vw"
      >
        <div class="uv-file-preview-modal-header">
          <img :src="currentFile.icon" class="file-icon" />
          <h3>{{ currentFile.fileName }}</h3>
          <t-button
            class="close-btn"
            size="small"
            shape="square"
            variant="text"
            @click="filePreview = false"
          >
            <icon name="close" size="18" />
          </t-button>
        </div>
        <div class="umo-file-preview-modal-body">
          <iframe :src="currentFile.previewURL"></iframe>
        </div>
      </modal>
    </template>
    <template v-else>
      <t-empty
        :title="t('page_error_title')"
        :description="t('page_error_description')"
      >
        <template #image>
          <icon name="error" size="72" />
        </template>
        <template #action>
          <t-button
            :href="`https://dev.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs/viewer/options#content`"
            target="_blank"
          >
            {{ t('page_error_action') }}
          </t-button>
        </template>
      </t-empty>
    </template>
  </article>
</template>

<script setup>
import { player } from '@/utils/player'

const container = inject('container')
const options = inject('options')
const state = inject('state')
const { locale, t } = useI18n()

state.value.loaded = false
const pageError = ref(false)

// 远程加载第三方资源
const loadedScripts = (() => {
  const key = '__umoViewerLoadedScripts'
  if (!globalThis[key]) {
    globalThis[key] = new Set()
  }
  return globalThis[key]
})()
const resolveCdnUrl = (url) => {
  if (typeof url !== 'string' || !url) return url
  if (/^(https?:)?\/\//.test(url)) return url
  if (url.startsWith('data:') || url.startsWith('blob:')) return url
  const base =
    typeof options.value.cdnUrl === 'string' ? options.value.cdnUrl : ''
  const normalizedBase = base.trim().replace(/\/+$/, '')
  if (!normalizedBase) return url
  if (url.startsWith('/')) return `${normalizedBase}${url}`
  return `${normalizedBase}/${url}`
}
const loadRemoteScript = (src) => {
  const resolvedSrc = resolveCdnUrl(src)
  if (loadedScripts.has(resolvedSrc)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${resolvedSrc}"]`)
    if (existing) {
      loadedScripts.add(resolvedSrc)
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = resolvedSrc
    script.async = true
    script.onload = () => {
      loadedScripts.add(resolvedSrc)
      resolve()
    }
    script.onerror = () =>
      reject(new Error(`Failed to load script: ${resolvedSrc}`))
    document.querySelector('head')?.append(script)
  })
}
const loadedStyles = (() => {
  const key = '__umoViewerLoadedStyles'
  if (!globalThis[key]) {
    globalThis[key] = new Set()
  }
  return globalThis[key]
})()
const loadRemoteStyle = (href, id) => {
  const resolvedHref = resolveCdnUrl(href)
  if (loadedStyles.has(resolvedHref)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    if (id) {
      const existingById = document.querySelector(`#${id}`)
      if (existingById) {
        loadedStyles.add(resolvedHref)
        resolve()
        return
      }
    }
    const existing = document.querySelector(
      `link[rel="stylesheet"][href="${resolvedHref}"]`,
    )
    if (existing) {
      loadedStyles.add(resolvedHref)
      resolve()
      return
    }
    const link = document.createElement('link')
    link.href = resolvedHref
    link.rel = 'stylesheet'
    if (id) link.id = id
    link.onload = () => {
      loadedStyles.add(resolvedHref)
      resolve()
    }
    link.onerror = () =>
      reject(new Error(`Failed to load style: ${resolvedHref}`))
    document.querySelector('head')?.append(link)
  })
}
const scheduleTask = (fn) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => fn(), { timeout: 1000 })
    return
  }
  setTimeout(fn, 0)
}
const getEcharts = async () => {
  if (globalThis.echarts?.init) return globalThis.echarts
  await loadRemoteScript('libs/echarts/echarts.min.js')
  if (globalThis.echarts?.init) return globalThis.echarts
  throw new Error('ECharts not loaded')
}
const ensurePlyr = async () => {
  if (globalThis.Plyr) return
  await Promise.all([
    loadRemoteStyle('libs/plyr/plyr.min.css', 'plyr-style'),
    loadRemoteScript('libs/plyr/plyr.min.js'),
  ])
}

// 页面大小
const pageRef = ref(null)
const pageSize = reactive({
  width: 0,
  height: 0,
})
// 校验页面内容
const checkPageContent = () => {
  const pageNode = pageRef.value.querySelector('.umo-page-content')
  if (!pageNode) {
    console.error(
      'Please provide the document HTML content. See: https://dev.umodoc.com/en/docs/viewer/options#content',
    )
    pageError.value = true
    return false
  }
  pageError.value = false
  return true
}
// 设置页面信息
const setPageInfo = () => {
  // 页面大小
  const pageEl = pageRef.value.querySelector(`.umo-page-content`)
  if (!pageEl) return
  pageSize.width = pageEl.clientWidth
  pageSize.height = pageEl.clientHeight
  if (!state.value.page.width) {
    state.value.page.width = pageSize.width
  }
  const getStyle = (prop) => {
    return getComputedStyle(pageEl)
      .getPropertyValue(`--umo-page-${prop}`)
      .trim()
  }
  state.value.page.orientation = getStyle('orientation')
  state.value.page.background = getStyle('background')
  state.value.page.top = getStyle('margin-top')
  state.value.page.bottom = getStyle('margin-bottom')
  state.value.page.left = getStyle('margin-left')
  state.value.page.right = getStyle('margin-right')
  state.value.page.pageWidth = getStyle('width')
  state.value.page.pageHeight = getStyle('height')
}

// 功能扩展
const images = ref([])
const currentImage = ref(0)
const imageViewer = ref(false)
const filePreview = ref(false)
const currentFile = ref({
  icon: '',
  fileName: '',
  previewURL: '',
})
const enhancement = async () => {
  if (!checkPageContent()) return

  // 图片节点
  const imageNodes = pageRef.value.querySelectorAll('.umo-node-image')
  imageNodes.forEach((node) => {
    const image = node.querySelector('img[src]:not(.umo-icon)')
    if (image?.src) {
      images.value.push({
        id: image.getAttribute('data-id'),
        mainImage: image.src,
      })
      image.style.cursor = 'pointer'
      const setImageViewer = () => {
        currentImage.value = images.value.findIndex(
          (item) => item.id === image.getAttribute('data-id'),
        )
        imageViewer.value = true
      }
      image.addEventListener('click', setImageViewer)
      onBeforeUnmount(() => {
        image.removeEventListener('click', setImageViewer)
      })
    }
  })

  // 视频音频节点
  const mediaNodes = pageRef.value.querySelectorAll('video, audio')
  if (mediaNodes.length > 0) {
    const mediaNodeList = Array.from(mediaNodes)
    ensurePlyr()
      .catch(() => null)
      .then(() => {
        scheduleTask(() => {
          mediaNodeList.forEach((node) => {
            try {
              player(node, locale.value)
            } catch {}
          })
        })
      })
  }

  // 文件节点
  const fileNodes = pageRef.value.querySelectorAll('.umo-node-file')
  fileNodes.forEach((node) => {
    const preview = node.querySelector('[data-preview-url]')
    const setFilePreview = () => {
      currentFile.value.previewURL = preview.getAttribute('data-preview-url')
      currentFile.value.fileName = preview.getAttribute('data-file-name')
      currentFile.value.icon = preview.getAttribute('data-file-icon')
      filePreview.value = true
    }
    if (!preview) return
    preview.addEventListener('click', setFilePreview)
    onBeforeUnmount(() => {
      preview.removeEventListener('click', setFilePreview)
    })
  })

  // 代码块节点
  const codeBlockNodes = pageRef.value.querySelectorAll('.umo-code-block')
  codeBlockNodes.forEach((node) => {
    const copyButton = node.querySelector('.umo-copy-button')
    if (!copyButton) return
    copyButton.addEventListener('click', () => {
      const code = node.querySelector('pre').textContent
      const { copy, isSupported, copied } = useClipboard({ source: code })
      if (!isSupported.value) {
        copyButton.remove()
        return
      }
      copy()
      if (copied.value) {
        MessagePlugin.success(t('code_copy_success'))
      }
    })
  })

  // 图表节点
  const chartNodes = pageRef.value.querySelectorAll('.umo-node-echarts')
  if (chartNodes.length > 0) {
    const chartNodeList = Array.from(chartNodes)
    getEcharts()
      .then((echarts) => {
        scheduleTask(() => {
          chartNodeList.forEach((node) => {
            const chartNode = node.querySelector('.umo-node-echarts-body')
            if (!chartNode) return
            const optionStr = node.getAttribute('data-options')
            if (!optionStr) return
            let option
            try {
              option = JSON.parse(optionStr)
            } catch {
              return
            }
            const chart = echarts.init(chartNode)
            chart.setOption(option)
            chart.on('finished', () => {
              const chartImage = chart.getDataURL({
                pixelRatio: 2,
                backgroundColor: '#fff',
              })
              node.setAttribute('data-chart-url', chartImage)
            })
          })
        })
      })
      .catch(() => {})
  }

  // 公式节点样式
  const mathNodes = pageRef.value.querySelectorAll(
    '.tiptap-mathematics-render, .Tiptap-mathematics-render',
  )
  if (mathNodes.length > 0) {
    loadRemoteStyle('libs/katex/katex.min.css', 'katex-style')
  }
}
onMounted(async () => {
  state.value.loaded = true
  await nextTick()
  setPageInfo()
  enhancement()
})

// 页面大纲
const getTocFromContent = () => {
  if (!checkPageContent()) {
    return []
  }
  const editorEl = document.querySelector(`${container} .umo-editor`)
  if (!editorEl) {
    return
  }
  const headingsArr = Array.from(
    editorEl.querySelectorAll('h1, h2, h3, h4, h5, h6'),
  )

  const headings = headingsArr.map((el) => {
    return {
      level: parseInt(el.tagName.substring(1), 10),
      label: el.textContent.trim(),
      value: el.getAttribute('data-toc-id') || null,
    }
  })

  // 将扁平化 heading 列表构造成树状结构
  const root = []
  const stack = []

  for (const heading of headings) {
    const { level, label, value } = heading
    const node = { level, label, value, children: [] }

    // 找到栈中可以作为其父节点的元素
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(node) // 无父节点，属于根节点
    } else {
      stack[stack.length - 1].node.children.push(node)
    }

    // 当前 heading 入栈，成为后续可能的父节点
    stack.push({ level: heading.level, node })
  }

  return root
}
onMounted(async () => {
  await nextTick()
  const toc = getTocFromContent()
  state.value.toc = toc
  if (toc.length > 0) {
    state.value.activeHeading = [toc[0].value]
  }
})

// 页面滚动时，更新当前选中的大纲
let mainBodyEl = null
const setActiveHeading = () => {
  if (state.value.aside !== 'toc' || !mainBodyEl) {
    return
  }
  const containerTop = mainBodyEl.getBoundingClientRect().top
  const headings = mainBodyEl.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let closest = null
  let minOffset = -Infinity

  for (const heading of headings) {
    const offset = heading.getBoundingClientRect().top - containerTop
    if (offset <= 0 && offset > minOffset) {
      minOffset = offset
      closest = heading
    }
  }
  if (!closest) {
    return
  }
  const tocId = closest.getAttribute('data-toc-id')
  if (tocId) {
    state.value.activeHeading = [tocId]
  }
}
onMounted(() => {
  mainBodyEl = document.querySelector(`${container} .umo-viewer-main-body`)
  mainBodyEl.addEventListener('scroll', setActiveHeading)
})
onUnmounted(() => {
  mainBodyEl.removeEventListener('scroll', setActiveHeading)
})
watch(
  () => state.value.aside,
  async (aside) => {
    if (aside === 'toc') {
      setTimeout(setActiveHeading, 500)
    }
  },
)
</script>

<style lang="less">
.vu-viewer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.uv-page-error {
}
.umo-zoomable-container {
  box-shadow: var(--uv-page-shadow);
  margin: 0 auto;
  p,
  ol,
  ul {
    margin: 0;
    padding: 0;
  }
}
.uv-image-viewer {
  &__modal {
    &-mask {
      background-color: var(--uv-color-white) !important;
      opacity: 0.8 !important;
    }
    &-header {
      border-bottom: solid 1px var(--uv-border-color-light);
    }
    &-icon {
      opacity: 0.5;
    }
    &-close-bt {
      margin-top: -60px;
    }
    &-utils-content {
      box-shadow: var(--uv-shadow);
      border: 1px solid var(--uv-border-color);
      background-color: var(--uv-color-white);
    }
  }
}
.uv-file-preview-modal {
  padding: 0 !important;
  overflow: hidden;
  .t-dialog {
    &__header {
      display: none !important;
    }
    &__body {
      padding: 0 !important;
    }
  }
  &-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 15px;
    position: relative;
    .file-icon {
      height: 24px;
      display: block;
    }
    h3 {
      margin: 0;
      font-size: 18px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      width: calc(100% - 100px);
    }
    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
  &-body {
    iframe {
      display: block;
      width: 100%;
      height: calc(90vh - 164px);
      border: solid 1px var(--umo-border-color-light);
      box-sizing: border-box;
    }
  }
}
.Tiptap-mathematics-render,
.tiptap-mathematics-render {
  background: none !important;
  cursor: default !important;
}
</style>
