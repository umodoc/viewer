<template>
  <div class="examples">
    <div class="box">
      <umo-viewer
        v-bind="options"
        @close="onClose"
        @edit="onEdit"
        @validate-password="onValidatePassword"
      >
      </umo-viewer>
    </div>
  </div>
</template>

<script setup>
import html from '../public/test/demo.html?raw'
import '@umoteam/editor/style'

const options = ref({
  lang: 'zh-CN',
  theme: 'light',
  mode: ['html', 'pdf'],
  title: 'umo-viewer demo',
  meta: [
    {
      label: '作者',
      content: 'Umo Team',
    },
    {
      label: '简介',
      content: 'Umo Viewer 是一款 PDF 文档查看器，同时也支持预览富文本内容',
    },
  ],
  showHeader: true,
  showAside: true,
  html,
  // https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf
  pdf: '/umo-viewer/test/demo.pdf',
  editable: true,
  printable: true,
  downloadable: true,
  closeable: true,
  shareUrl: 'https://baidu.com',
  fitWidth: false,
  needPassword: false,
})

const onEdit = () => {
  const a = document.createElement('a')
  a.href = 'https://www.umodoc.com/demo'
  a.target = '_blank'
  a.click()
  a.remove()
}

const onClose = () => {
  console.log('onClose')
}
const onValidatePassword = (password) => {
  return password === '111'
}
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.examples {
  margin: 20px;
  display: flex;
  height: calc(100vh - 40px);
}
.box {
  border: solid 1px var(--uv-border-color);
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
