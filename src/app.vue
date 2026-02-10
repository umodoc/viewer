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
import '@umoteam/editor/style'
import content from '../public/test/content.txt?raw'

const options = ref({
  lang: 'zh-CN',
  theme: 'light',
  title: 'umo-viewer demo',
  meta: [
    {
      label: '作者',
      content: 'Umo Team',
    },
    {
      label: '简介',
      content: 'Umo Viewer 支持预览 Umo Editor 文档内容',
    },
  ],
  cdnUrl: 'https://beta.cdn.umodoc.com',
  showHeader: true,
  showAside: true,
  content,
  editable: true,
  printable: true,
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
