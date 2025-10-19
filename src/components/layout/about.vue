<template>
  <modal
    :visible="state.about"
    width="300px"
    placement="center"
    :footer="false"
    @close="state.about = false"
  >
    <template #header>
      <icon name="about" />
      <span>{{ t('about') }}</span>
    </template>
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 2;
        padding: 50px 0 40px;
      "
    >
      <a href="https://www.umodoc.com" target="_blank">
        <img src="@/assets/images/logo.svg" width="160" style="display: flex" />
      </a>
      <p>
        Umo Viewer by
        <a href="https://www.umodoc.com" target="_blank">Umodoc</a>
      </p>
      <p>{{ t('version') }}: Version {{ version }}</p>
      <p>
        <a href="https://github.com/umodoc" target="_blank"> Github </a>
        |
        <a
          :href="`https://dev.umodoc.com/${locale === 'zh-CN' ? 'cn' : 'en'}/docs/viewer`"
          target="_blank"
        >
          {{ t('documentation') }}
        </a>
        |
        <a href="https://www.npmjs.com/package/@umoteam/viewer" target="_blank">
          NPM
        </a>
      </p>
    </div>
  </modal>
</template>

<script setup>
import { version } from '../options'

const { t, locale } = useI18n()
const state = inject('state')
</script>

<style lang="less" scoped>
img {
  margin-bottom: 30px;
}
p {
  margin: 5px 0;
  line-height: 1.5;
  color: var(--uv-text-color-light);
  a {
    color: #3480f9;
    font-weight: 500;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
