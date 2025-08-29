<template>
  <aside v-if="options.showAside && state.loaded" class="umo-viewer-main-aside">
    <page-aside />
  </aside>
  <div class="umo-viewer-main-body uv-scrollbar" :data-view="state.view">
    <template v-if="options.needPassword">
      <page-password />
    </template>
    <template v-else>
      <page-html v-if="state.view === 'html'" />
      <page-pdf v-if="state.view === 'pdf'" />
    </template>
  </div>
  <t-loading
    class="umo-viewer-loading"
    :attach="`${container} .umo-viewer-main`"
    :loading="!options.needPassword && !state.loaded"
    :text="t('loading')"
    size="small"
    prevent-scroll-through
  />
  <t-back-top
    class="umo-viewer-main-back-top"
    :container="`${container} .umo-viewer-main-body`"
    :visible-height="800"
    size="small"
    :offset="['20px', '20px']"
  />
</template>

<script setup>
const { t } = useI18n()
const container = inject('container')
const options = inject('options')
const state = inject('state')

// 视图模式发生变化时，页面容器滚动到顶部
watch(
  () => state.value.view,
  () => {
    document.querySelector(`${container} .umo-viewer-main-body`).scrollTop = 0
    state.value.loaded = false
  },
)
</script>

<style lang="less" scoped>
.umo-viewer-main {
  &-body {
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--uv-container-background);
    scroll-behavior: smooth;
    flex: 1;
    position: relative;
    &[data-view='pdf'] {
      display: flex;
      flex-direction: column;
    }
  }
  &-back-top {
    position: absolute;
    &:hover {
      opacity: 0.9;
      background-color: var(--uv-color-white) !important;
      .uv-back-top__icon {
        color: var(--uv-primary-color);
      }
    }
  }
}
</style>

<style lang="less">
.umo-viewer-loading {
  .uv-icon-loading,
  .uv-loading__text {
    filter: grayscale(100%);
    opacity: 0.8;
  }
}
</style>
