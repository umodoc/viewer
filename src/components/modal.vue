<template>
  <component
    :is="h(Dialog, { ...$attrs, attach: container, ref: changeRef }, $slots)"
  />
</template>

<script setup>
import { Dialog } from 'tdesign-vue-next'
import { h } from 'vue'

const container = inject('container')
const vm = getCurrentInstance()
const changeRef = (expose) => (vm.expose = expose)
</script>
