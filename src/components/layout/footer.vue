<template>
  <div class="umo-viewer-footer-left">
    <t-button
      class="umo-viewer-footer-button auto-width"
      variant="text"
      size="small"
      @click="options.showAside = !options.showAside"
    >
      <icon :name="options.showAside ? 'aside-fold' : 'aside'" size="14" />
      {{ options.showAside ? t('aside_fold') : t('aside_open') }}
    </t-button>
    <template v-if="views.length > 1">
      <div class="umo-viewer-footer-split"></div>
      <t-dropdown :attach="container" placement="top-left" trigger="click">
        <t-button
          class="umo-viewer-footer-button auto-width"
          variant="text"
          size="small"
        >
          <icon :name="currentView.value" size="14" />
          {{ currentView.content }}
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item
            v-for="item in views"
            :key="item.value"
            :value="item.value"
            :active="item.value === state.view"
            @click="state.view = item.value"
          >
            <div class="umo-viewer-footer-dropdown-item">
              <icon :name="item.value" size="16" />
              {{ item.content }}
            </div>
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </template>
  </div>
  <div class="umo-viewer-footer-right">
    <tooltip v-if="state.view === 'pdf'" :content="t('show_multi_page')">
      <t-button
        class="umo-viewer-footer-button"
        :class="{ active: options.showMultiPage }"
        variant="text"
        size="small"
        @click="options.showMultiPage = !options.showMultiPage"
      >
        <icon name="column" />
      </t-button>
    </tooltip>
    <tooltip
      :content="
        fullscreenRef?.isFullscreen ? t('fullscreen_exit') : t('fullscreen')
      "
    >
      <t-button
        class="umo-viewer-footer-button"
        variant="text"
        size="small"
        @click="toggleFullscreen"
      >
        <icon
          :name="fullscreenRef?.isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
        />
      </t-button>
    </tooltip>
    <div class="umo-viewer-footer-split"></div>
    <div class="umo-viewer-zoom-bar">
      <tooltip :content="t('zoom_out')">
        <t-button
          class="umo-viewer-footer-button"
          variant="text"
          size="small"
          :disabled="state.zoom <= 0.2"
          @click="zoomOut"
        >
          <icon name="minus" />
        </t-button>
      </tooltip>
      <t-slider
        v-model="state.zoom"
        class="umo-viewer-zoom-slider"
        :min="0.2"
        :max="5"
        :step="0.01"
        :tooltip-props="{
          showArrow: false,
          theme: 'light',
          popperOptions: {
            modifiers: [{ name: 'offset', options: { offset: [0, 2] } }],
          },
          content: t('zoom_level', { zoom: (state.zoom * 100).toFixed(0) }),
        }"
      ></t-slider>
      <tooltip :content="t('zoom_in')">
        <t-button
          class="umo-viewer-footer-button"
          variant="text"
          size="small"
          :disabled="state.zoom >= 5"
          @click="zoomIn"
        >
          <icon name="plus" />
        </t-button>
      </tooltip>
      <tooltip :content="t('fit_width')">
        <t-button
          class="umo-viewer-footer-button"
          :class="{ active: options.fitWidth }"
          variant="text"
          size="small"
          @click="setFitWidth(!options.fitWidth)"
        >
          <icon name="auto-width" />
        </t-button>
      </tooltip>
      <tooltip :content="t('reset_width')">
        <t-button
          class="umo-viewer-footer-button auto-width"
          style="width: 40px"
          variant="text"
          size="small"
          @click="zoomReset"
        >
          {{ (state.zoom * 100).toFixed(0) }}%
        </t-button>
      </tooltip>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const container = inject('container')
const options = inject('options')
const state = inject('state')

// 视图设置
const views = computed(() => {
  const names = {
    html: t('view_html'),
    pdf: t('view_pdf'),
  }
  return options.value.mode.map((item) => {
    return {
      content: names[item],
      value: item,
    }
  })
})
const currentView = computed(() => {
  return views.value.find((item) => item.value === state.value.view)
})
watch(currentView, () => {
  state.value.aside = currentView === 'html' ? 'toc' : 'thumbs'
})

// 全屏设置
const fullscreenRef = ref(null)
onMounted(() => {
  fullscreenRef.value = useFullscreen(document.querySelector(container))
})
const toggleFullscreen = () => {
  fullscreenRef.value.toggle()
}

// 缩放设置
const zoomOut = () => {
  if (state.value.zoom > 0.2) {
    options.value.fitWidth = false
    state.value.zoom = Number((state.value.zoom - 0.1).toFixed(1))
  }
}
const zoomIn = () => {
  if (state.value.zoom < 5) {
    options.value.fitWidth = false
    state.value.zoom = Number((state.value.zoom + 0.1).toFixed(1))
  }
}
const zoomReset = () => {
  options.value.fitWidth = false
  state.value.zoom = 1
}

// 自动宽度
const initialized = ref(false)
const setFitWidth = async (enabled = true) => {
  options.value.fitWidth = enabled
  if (!enabled) {
    zoomReset()
    return
  }
  try {
    const pageMainEl = document.querySelector(
      `${container} .umo-viewer-main-body`,
    )
    if (!pageMainEl) return
    const pageMainWidth = pageMainEl?.clientWidth
    const { page } = state.value
    await nextTick()
    state.value.zoom = Number(
      ((pageMainWidth - 40) / (page.width + 15)).toFixed(2),
    )
    if (state.value.view === 'pdf') {
      options.value.showMultiPage = false
    }
  } catch {}
}
watch(
  () => state.value.loaded,
  (loaded) => {
    if (loaded && options.value.fitWidth && !initialized.value) {
      setFitWidth(true)
      initialized.value = true
    }
  },
)

// 页面容器大小发生变化后，如果是自动宽度，则重新设置宽度
let observer = null
onMounted(() => {
  const pageMainEl = document.querySelector(
    `${container} .umo-viewer-main-body`,
  )
  let pageMainWidth = null
  const debouncedFn = useDebounceFn(() => {
    setFitWidth(true)
  }, 1000)
  observer = new ResizeObserver((entries) => {
    const { width } = entries[0].contentRect
    if (options.value.fitWidth && pageMainWidth !== width) {
      debouncedFn()
      pageMainWidth = width
    }
  })
  observer.observe(pageMainEl)
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style lang="less" scoped>
.umo-viewer-footer {
  padding: 6px 10px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  font-size: var(--uv-font-size-small);
  overflow: hidden;

  @media screen and (max-width: 640px) {
    overflow-x: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-dropdown-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &-split {
    height: 16px;
    width: 1px;
    background-color: var(--uv-border-color);
    margin: 0 10px;
  }
  &-button {
    --td-comp-size-xs: 20px;
    --td-comp-paddingLR-l: 8px;
    --td-radius-default: 2px;
    font-size: 14px;
    margin: 0 2px;
    color: var(--uv-text-color);
    &:not(.auto-width) {
      width: var(--td-comp-size-xs);
    }
    &.auto-width {
      --td-comp-paddingLR-s: 0;
      font-size: var(--uv-font-size-small);
      width: auto;
      :deep(.uv-button__text) {
        display: flex;
        align-items: center;
        gap: 3px;
        .uv-icon {
          font-size: 14px;
        }
      }
    }
    :deep(.uv-button__text) {
      padding: 0 5px;
    }
    &.active {
      background-color: var(--td-bg-color-container-hover);
      color: var(--uv-primary-color);
    }
  }
  &-left {
    display: flex;
    align-items: center;
  }

  &-right {
    display: flex;
    align-items: center;
  }

  .umo-viewer-zoom-bar {
    display: flex;
    --td-comp-size-xxxs: 8px;
    --td-size-2: 3px;
    --td-brand-color: var(--uv-text-color);
    .umo-viewer-zoom-slider {
      width: 100px;
      :deep(.uv-slider__button) {
        background: var(--td-brand-color);
        border: none;
        box-shadow: none;
      }
      :deep(.uv-slider__track) {
        background: none;
      }
    }
  }
  @media screen and (max-width: 720px) {
    .umo-viewer-zoom-bar {
      width: auto;
    }
    .umo-viewer-zoom-slider {
      display: none !important;
    }
  }
}
</style>
