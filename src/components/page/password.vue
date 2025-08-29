<template>
  <div class="umo-viewer-page-password">
    <t-form
      ref="formRef"
      :data="formData"
      layout="inline"
      label-align="top"
      :rules="rules"
      @submit="onSubmit"
    >
      <t-form-item :label="t('need_password')" name="password">
        <t-input
          v-model="formData.password"
          style="width: 240px"
          type="password"
          :placeholder="t('need_password_tip')"
          clearable
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
        </t-input>
      </t-form-item>
    </t-form>
  </div>
</template>

<script setup>
import { LockOnIcon } from 'tdesign-icons-vue-next'
import { DialogPlugin } from 'tdesign-vue-next'

const { t } = useI18n()
const container = inject('container')
const options = inject('options')

const formRef = ref(null)
const formData = reactive({
  password: '',
})
const rules = {
  password: [{ required: true, message: ' ', type: 'error', trigger: 'blur' }],
}

const onSubmit = async ({ validateResult, e }) => {
  e.preventDefault()
  if (!validateResult) {
    return
  }
  try {
    const result = await options.value.onValidatePassword(formData.password)
    if (!result) {
      const dialog = DialogPlugin.alert({
        width: 400,
        attach: container,
        placement: 'center',
        theme: 'danger',
        header: t('dialog'),
        body: t('need_password_error'),
        onClose() {
          dialog.destroy()
          formData.password = ''
        },
        onConfirm() {
          dialog.destroy()
          formData.password = ''
        },
      })
      return
    }
    options.value.needPassword = false
  } catch (err) {
    console.error(
      'Please configure password validation method correctly: onValidatePassword(password)',
    )
  }
}
</script>

<style lang="less" scoped>
.umo-viewer-page-password {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.uv-form) {
    &__label {
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
