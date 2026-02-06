<template>
  <div class="umo-viewer-aside-container">
    <div class="umo-viewer-aside-content">
      <t-tabs v-model="state.aside" class="umo-viewer-tabs">
        <template #action>
          <tooltip :content="t('aside_fold')">
            <t-button
              class="umo-viewer-aside-close"
              variant="text"
              shape="square"
              @click="options.showAside = false"
            >
              <icon name="aside-fold" size="18" />
            </t-button>
          </tooltip>
        </template>
        <t-tab-panel value="toc" destroy-on-hide>
          <template #label>
            <icon name="toc" />
            <span>{{ t('toc') }}</span>
          </template>
          <div class="umo-viewer-tabs-content uv-scrollbar">
            <div v-if="state.toc?.length > 0" class="umo-viewer-aside-toc">
              <t-tree
                v-model:actived="state.activeHeading"
                :data="state.toc"
                :transition="false"
                activable
                hover
                expand-all
                @active="headingActive"
              />
            </div>
            <div v-else class="umo-viewer-aside-toc-empty">
              {{ t('toc_empty') }}
            </div>
          </div>
        </t-tab-panel>
        <t-tab-panel v-if="options.meta.length > 0" value="info">
          <template #label>
            <icon name="info" />
            <span>{{ t('doc_info') }}</span>
          </template>
          <div class="umo-viewer-tabs-content uv-scrollbar">
            <t-descriptions table-layout="auto" :column="1">
              <t-descriptions-item
                v-for="(item, index) in options.meta"
                :key="index"
                :label="item.label"
              >
                {{ item.content }}
              </t-descriptions-item>
            </t-descriptions>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const container = inject('container')
const options = inject('options')
const state = inject('state')

// 页面大纲
const headingActive = (value) => {
  const heading = document.querySelector(
    `${container} .umo-editor [data-toc-id="${value}"]`,
  )
  if (heading) {
    heading.scrollIntoView({
      block: 'start',
    })
  }
}

// 监听当前大纲，大纲滚动到可视区域
watch(
  () => state.value.activeHeading,
  async () => {
    await nextTick()
    setTimeout(() => {
      try {
        document
          .querySelector(`${container} .umo-viewer-aside-toc .uv-is-active`)
          .scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          })
      } catch {}
    }, 300)
  },
)
</script>

<style lang="less" scoped>
@import '@/assets/styles/index.less';

.umo-viewer-aside {
  &-container {
    background-color: var(--uv-color-white);
    border-right: solid 1px var(--uv-border-color);
    width: 300px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
  }

  &-content {
    height: 100%;
    overflow: hidden;
    :deep(.uv-tabs) {
      --td-comp-size-xxl: 42px;
      --td-comp-size-m: 26px;
      --td-text-color-secondary: var(--uv-text-color);
      height: 100%;
      &__nav-item {
        &-text-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          .uv-icon {
            font-size: 18px;
          }
        }
        &-wrapper {
          --td-comp-margin-s: 8px;
        }
      }
      &__operations {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 10px;
        margin-top: -1px;
      }
      &__content {
        height: calc(100% - var(--td-comp-size-xxl));
      }
      .uv-tab-panel {
        height: 100%;
      }
      .umo-viewer-tabs-content {
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        scroll-padding-top: 15px;
        scroll-padding-bottom: 15px;
        scroll-behavior: smooth;
      }
    }
    :deep(.uv-descriptions) {
      td {
        padding: 5px 0;
        &.uv-descriptions__label {
          white-space: nowrap;
          padding-right: 10px;
          vertical-align: top;
          color: var(--uv-text-color-light);
        }
      }
    }
    :deep(.uv-tree) {
      --td-comp-size-m: 28px;
      --td-comp-paddingLR-xs: 8px;
      --td-comp-margin-xs: 0;
      --td-brand-color-light: var(--uv-container-background);
      user-select: none;
      :deep(.uv-tree__empty) {
        height: 60px;
        font-size: 12px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--uv-text-color-light);
      }
      :deep(.uv-is-active) {
        font-weight: 400;
        color: var(--uv-primary-color);
      }
    }
  }
  &-toc {
    &-empty {
      text-align: center;
      padding: 50px 20px;
      color: var(--uv-text-color-light);
    }
  }
}
</style>
