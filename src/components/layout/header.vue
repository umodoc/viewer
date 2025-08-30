<template>
  <div class="umo-viewer-header-title">
    <t-dropdown
      v-if="!options.needPassword"
      :attach="container"
      :popup-props="{
        onVisibleChange: (visible) => (menuVisible = visible),
      }"
      :disabled="!state.loaded"
      trigger="click"
      placement="bottom-left"
    >
      <t-button
        class="umo-viewer-header-menu"
        :variant="menuVisible ? 'outline' : 'text'"
        :disabled="!state.loaded"
        shape="square"
      >
        <icon name="menu" size="20" />
      </t-button>
      <t-dropdown-menu>
        <t-dropdown-item value="share" divider @click="about">
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="about" />
            {{ t('about') }}
          </div>
        </t-dropdown-item>
        <t-dropdown-item
          v-if="options.meta.length > 0"
          value="info"
          @click="openInfoAside"
        >
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="info" />
            {{ t('info') }}
          </div>
        </t-dropdown-item>
        <t-dropdown-item v-if="options.editable" value="edit" @click="onEdit">
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="edit" />
            {{ t('edit') }}
          </div>
        </t-dropdown-item>
        <t-dropdown-item v-if="options.printable" value="print" @click="print">
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="print" />
            {{ t('print') }}
          </div>
        </t-dropdown-item>
        <t-dropdown-item
          v-if="options.downloadable"
          value="download"
          @click="download"
        >
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="download" />
            {{ t('download') }}
          </div>
        </t-dropdown-item>
        <t-dropdown-item
          v-if="options.shareUrl?.length > 0"
          value="share"
          @click="share"
        >
          <div class="umo-viewer-header-actions-dropdown-item">
            <icon name="share" />
            {{ t('share') }}
          </div>
        </t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
    <h2>{{ options.title }}</h2>
  </div>
  <div class="umo-viewer-header-actions">
    <t-button
      v-if="options.closeable"
      shape="square"
      variant="text"
      @click="onClose"
    >
      <icon name="close" size="18" />
    </t-button>
  </div>
</template>

<script setup>
import { DialogPlugin } from 'tdesign-vue-next'

const { t } = useI18n()
const container = inject('container')
const options = inject('options')
const state = inject('state')

const menuVisible = ref(false)

const openInfoAside = () => {
  options.value.showAside = true
  state.value.aside = 'info'
}

const onEdit = () => {
  if (!options.value.onEdit) {
    console.error('Please configure the edit event correctly: onEdit()')
    return
  }
  options.value.onEdit()
}

const print = () => {
  state.value.printing = true
}

const download = () => {
  if (state.value.view === 'html') {
    const dialog = DialogPlugin.confirm({
      attach: container,
      theme: 'info',
      header: t('download'),
      body: t('download_message'),
      confirmBtn: t('download_confirm'),
      onConfirm() {
        dialog.destroy()
        print()
      },
    })
    return
  }
  // 创建下载链接
  const link = document.createElement('a')
  link.href = options.value.pdf
  link.download = `${options.value.title}.pdf`
  link.click()
  // 移除下载链接
  link.remove()
}

const share = () => {
  state.value.sharing = true
}

const about = () => {
  state.value.about = true
}

const onClose = () => {
  if (!options.value.onClose) {
    console.error('Please configure the close event correctly: onClose()')
    return
  }
  options.value.onClose()
}
</script>

<style lang="less" scoped>
.umo-viewer-header {
  &-title {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    max-width: calc(100% - 100px);

    h2 {
      font-size: 18px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--uv-text-color);
    }
  }
  &-menu {
    flex-shrink: 0;
  }
  &-actions {
    display: flex;
    gap: 3px;
    flex-wrap: nowrap;
    &-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      padding: 3px 15px 3px 0;
      color: var(--uv-text-color);
      :deep(.uv-icon) {
        font-size: 18px;
        opacity: 0.6;
      }
    }
  }
}
</style>
