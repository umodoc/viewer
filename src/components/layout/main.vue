<template>
  <aside
    v-if="!options.needPassword && options.showAside && state.loaded"
    class="umo-viewer-main-aside"
  >
    <page-aside />
  </aside>
  <div class="umo-viewer-main-body uv-scrollbar">
    <page-password v-if="options.needPassword" />
    <page-content v-else />
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
</script>

<style lang="less" scoped>
.umo-viewer-main {
  &-body {
    padding: 20px;
    scroll-padding-top: 10px;
    scroll-padding-bottom: 10px;
    box-sizing: border-box;
    background-color: var(--uv-container-background);
    scroll-behavior: smooth;
    flex: 1;
    position: relative;
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
