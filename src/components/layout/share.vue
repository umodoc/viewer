<template>
  <modal
    :visible="state.sharing"
    width="420px"
    :confirm-btn="shareType === 'share' ? t('copy_link') : t('copy_code')"
    @confirm="copyCode"
    @close="state.sharing = false"
  >
    <template #header>
      <icon name="share" />
      <span>{{ t('share') }}</span>
    </template>
    <div class="umo-viewer-share-container">
      <t-radio-group
        class="umo-viewer-share-radio-group"
        v-model="shareType"
        size="small"
        variant="default-filled"
      >
        <t-radio-button value="link">{{ t('link') }}</t-radio-button>
        <t-radio-button value="embed">{{ t('embed') }}</t-radio-button>
      </t-radio-group>
      <div class="umo-viewer-share-tip">
        {{ shareType === 'share' ? t('share_link_tip') : t('share_embed_tip') }}
      </div>
      <t-textarea
        class="umo-viewer-share-textarea"
        :value="shareCode"
        readonly
        autosize
      ></t-textarea>
    </div>
  </modal>
</template>

<script setup>
const { t } = useI18n()
const options = inject('options')
const state = inject('state')

const shareType = ref('link')
const shareCode = computed(() => {
  if (shareType.value === 'link') {
    return options.value.shareUrl
  }
  return `<iframe src="${options.value.shareUrl}" width="100%" height="720px" frameborder="0" allowfullscreen="true"></iframe>`
})

const copyCode = () => {
  try {
    const { copy } = useClipboard({ source: shareCode })
    copy()
    MessagePlugin.success(
      t('share_copy_success', {
        type: `${shareType.value === 'share' ? t('link') : t('embed')}`,
      }),
    )
  } catch (error) {
    MessagePlugin.error(t('share_copy_failed'))
  }
  state.value.sharing = false
}
</script>

<style lang="less" scoped>
.umo-viewer-share-container {
  padding: 2px;
  .umo-viewer-share-radio-group {
    margin-bottom: 15px;
  }
  .umo-viewer-share-tip {
    font-size: 12px;
    color: var(--uv-text-color-light);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .umo-viewer-share-textarea {
    :deep(textarea) {
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
