<template>
  <iframe
    ref="iframeRef"
    class="umo-viewer-print-iframe"
    :srcdoc="iframeCode"
    :src="options.pdf"
  />
</template>

<script setup>
const container = inject('container')
const options = inject('options')
const state = inject('state')
const iframeRef = ref(null)
const iframeCode = ref(undefined)

const getStylesHtml = () => {
  return Array.from(document.querySelectorAll('link, style'))
    .map((item) => item.outerHTML)
    .join('')
}
const getIframeCode = () => {
  const { theme, title } = options.value
  const { view, page } = state.value
  if (view === 'pdf') {
    return undefined
  }
  const getPageHtml = () => {
    const pageNode = document
      .querySelector(`${container} .umo-page-content`)
      .cloneNode(true)
    // 图表节点处理
    pageNode.querySelectorAll('.umo-node-echarts').forEach((node) => {
      node.querySelector('.umo-node-echarts-body > div').innerHTML =
        `<img src="${node.getAttribute('data-chart-url')}" width="100%" height="100%" />`
    })
    return pageNode.outerHTML
  }
  return `
    <!DOCTYPE html>
    <html lang="zh-CN" theme-mode="${theme}">
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getStylesHtml()}
      <style>
      html{
        margin: 0;
        padding: 0;
        overflow: visible;
      }
      body{
        margin: 0;
        padding: 0;
        print-color-adjust: exact;
      }
      @page {
        size: ${page.orientation === 'portrait' ? page.pageWidth : page.pageHeight}cm ${page.orientation === 'portrait' ? page.pageHeight : page.pageWidth}cm; 
        padding: ${page.top} 0 ${page.bottom} 0;
        margin: 0;
      }
      @page:first {
        padding-top: 0;
      }
      @page:last {
        padding-bottom: 0;
        page-break-after: avoid;
      }
      .umo-node-echarts canvas, .umo-action-item[data-preview-url]{
        display: none !important;
      }
      </style>
    </head>
    <body class="is-print">
      <div class="umo-editor-container" aria-expanded="false">
        <div class="tiptap umo-editor" translate="no">
          ${getPageHtml()}
        </div>
      </div>
      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print()
          }, 200);
        })
        document.addEventListener("DOMContentLoaded", (event) => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.removedNodes) {
                Array.from(mutation.removedNodes).forEach(node => {
                  if (node?.classList?.contains('umo-viewer-page')) {
                    location.reload();
                  }
                });
              }
            });
          });
        });
      <\/script>
    </body>
    </html>`
}

const cancelPrint = () => {
  state.value.printing = false
}
onMounted(() => {
  if (state.value.view === 'html') {
    iframeCode.value = getIframeCode()
  } else {
    iframeRef.value.contentWindow.print()
  }
  window.addEventListener('focus', cancelPrint)
})
onUnmounted(() => {
  window.removeEventListener('focus', cancelPrint)
})
</script>

<style lang="less" scoped>
.umo-viewer-print-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border: none;
}
</style>
