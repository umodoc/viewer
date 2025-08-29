<template>
  <t-tooltip
    :content="content"
    :attach="container"
    theme="light"
    placement="top"
    :show-arrow="false"
    destroy-on-close
  >
    <slot />
  </t-tooltip>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
const container = inject('container')
</script>
