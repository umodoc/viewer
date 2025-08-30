<template>
  <article
    class="umo-viewer-pages"
    :style="{ 'flex-direction': options.showMultiPage ? 'row' : 'column' }"
  >
    <div
      class="umo-viewer-page"
      v-for="page in pages"
      :key="page"
      :id="`umo-viewer-page-${page}`"
      :data-page="page"
    >
      <pdf-page
        :pdf="pdf"
        :page="page"
        :width="state?.page.width ? state.page.width * state.zoom : undefined"
        :scale="state.zoom * 1.336"
        v-bind="$attrs"
        @loaded="onLoadPage"
      />
    </div>
  </article>
</template>

<script setup>
import { VuePDF as PdfPage, usePDF } from '@tato30/vue-pdf'

const container = inject('container')
const options = inject('options')
const state = inject('state')

state.value.loaded = false

const pdfDocument = usePDF(options.value.pdf)
const { pdf, pages } = pdfDocument
state.value.pdfDocument = pdfDocument

const onLoadPage = () => {
  state.value.loaded = true
  // 将页面实际宽高度赋值给 state
  if (!state.value.page.width) {
    const pageEl = document.querySelector(`${container} .umo-viewer-page`)
    state.value.page.width = pageEl.clientWidth
  }
}

// 页面滚动时，更新当前选中的缩略图
let mainBodyEl = null
const setActivePage = () => {
  if (state.value.aside !== 'thumbs' || !mainBodyEl) {
    return
  }
  const containerTop = mainBodyEl.getBoundingClientRect().top
  const items = mainBodyEl.querySelectorAll('.umo-viewer-page')
  let closest = null
  let minOffset = -Infinity

  for (let item of items) {
    const offset = item.getBoundingClientRect().top - containerTop
    if (offset <= 0 && offset > minOffset) {
      minOffset = offset
      closest = item
    }
  }

  if (!closest) {
    return
  }
  const page = Number(closest.dataset.page)
  if (page && !isNaN(page)) {
    state.value.activePage = page
  }
}
onMounted(() => {
  mainBodyEl = document.querySelector(`${container} .umo-viewer-main-body`)
  mainBodyEl.addEventListener('scroll', setActivePage)
})
onUnmounted(() => {
  mainBodyEl.removeEventListener('scroll', setActivePage)
})
watch(
  () => state.value.aside,
  async (aside) => {
    if (aside === 'thumbs') {
      setTimeout(setActivePage, 500)
    }
  },
)
</script>

<style lang="less" scoped>
.umo-viewer-pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto;
}
.umo-viewer-page {
  display: flex;
  box-shadow: var(--uv-page-shadow);
  > :deep(canvas) {
    display: flex;
  }
}
</style>
