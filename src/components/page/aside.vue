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
        <t-tab-panel v-if="state.view === 'html'" value="toc" destroy-on-hide>
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
        <t-tab-panel v-if="state.view === 'pdf'" value="thumbs" destroy-on-hide>
          <template #label>
            <icon name="thumb" />
            <span>{{ t('thumbs') }}</span>
          </template>
          <div class="umo-viewer-tabs-content uv-scrollbar">
            <div v-if="state?.pdfDocument" class="umo-viewer-aside-pages">
              <div
                class="umo-viewer-aside-page"
                :class="{ active: state.activePage === page }"
                v-for="page in state.pdfDocument.pages"
                :key="page"
                @click="scrollToPage(page)"
              >
                <pdf-page
                  :pdf="state.pdfDocument.pdf"
                  :page="page"
                  fit-parent
                />
                <span class="umo-viewer-aside-page-number">
                  {{ page }}/{{ state.pdfDocument.pages }}
                </span>
              </div>
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
import { VuePDF as PdfPage } from '@tato30/vue-pdf'

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

// 页面缩略图
const scrollToPage = (page) => {
  const canvas = document.querySelector(`${container} #umo-viewer-page-${page}`)
  if (canvas) {
    canvas.scrollIntoView({
      block: 'start',
    })
  }
}

// 监听当前页，缩略图滚动到可视区域
watch(
  () => state.value.activePage,
  async () => {
    await nextTick()
    setTimeout(() => {
      try {
        document
          .querySelector(`${container} .umo-viewer-aside-page.active`)
          .scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          })
      } catch {}
    }, 300)
  },
)

// 监听选项卡，当切换页面视图模式时，更新选中状态
watch(
  () => state.value.view,
  (view) => {
    if (state.value.aside === 'toc' && view === 'pdf') {
      state.value.aside = 'thumbs'
    }
    if (state.value.aside === 'thumbs' && view === 'html') {
      state.value.aside = 'toc'
    }
  },
  {
    immediate: true,
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
  &-pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -15px;
  }
  &-page {
    width: 150px;
    display: flex;
    position: relative;
    cursor: pointer;
    transition: outline 0.3s;
    max-width: 100%;
    user-select: none;
    padding-top: 15px;
    > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      outline: solid 1px var(--uv-border-color);
      transition: outline 0.3s;
    }
    &-number {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      padding: 2px 4px 3px;
      border-radius: 15px;
      line-height: 1;
      min-width: 30px;
      text-align: center;
    }
    &:hover {
      > :first-child {
        box-shadow:
          0 0 10px #0000000f,
          0 0 0 1px #0000000a;
      }
      .umo-viewer-aside-page-number {
        background-color: var(--uv-primary-color);
      }
    }
    &.active {
      > :first-child {
        outline: solid 2px var(--uv-primary-color);
      }
      .umo-viewer-aside-page-number {
        background-color: var(--uv-primary-color);
      }
    }
  }
}
</style>
