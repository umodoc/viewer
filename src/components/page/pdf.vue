<template>
  <article
    class="umo-viewer-pages"
    :style="{ 'flex-direction': options.showMultiPage ? 'row' : 'column' }"
  >
    <div
      v-for="page in pages"
      :id="`umo-viewer-page-${page}`"
      :key="page"
      class="umo-viewer-page"
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
import { usePDF, VuePDF as PdfPage } from '@tato30/vue-pdf'

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

// 监听滚动，同步改变 activePage
let observer = null
onMounted(() => {
  // 监听 umo-view-page 在可视区域的页面，通过 data-page 赋值 activePage
  const pagesEl = document.querySelector(`${container} .umo-viewer-main-body`)
  if (!pagesEl) {
    return
  }
  pagesEl.addEventListener('scroll', () => {
    // 监听当前哪个页面进入了可视区域
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activePage = Number(entry.target.dataset.page)
          if (activePage !== state.value.activePage) {
            state.value.activePage = activePage
          }
        }
      })
    })
    // 监听所有页面
    pagesEl.querySelectorAll('.umo-viewer-page').forEach((page) => {
      observer.observe(page)
    })
  })
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style lang="less" scoped>
.umo-viewer-pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
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
