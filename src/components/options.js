import { z } from 'zod'

import { version } from '../../package.json'

const props = {
  // Language
  lang: z.literal(['zh-CN', 'en-US'], 'Must be zh-CN or en-US'),

  // Theme
  theme: z.literal(['light', 'dark', 'auto'], 'Must be light, dark or auto'),

  // Document title
  title: z.string('Must be string').nonempty('Cannot be empty'),

  // Document meta, can be empty
  meta: z.array(
    z.object({
      label: z.string('label must be string').nonempty('Cannot be empty'),
      content: z.any(),
    }),
    'Must be array',
  ),

  // Page content
  content: z.string('Must be string').nonempty('Cannot be empty'),

  // CDN URL
  cdnUrl: z.string('Must be string').optional(),

  // Show header
  showHeader: z.boolean('Must be boolean'),

  // Show aside
  showAside: z.boolean('Must be boolean'),

  // Edit URL
  editable: z.boolean('Must be boolean').optional(),

  // Printable
  printable: z.boolean('Must be boolean'),

  // Closeable
  closeable: z.boolean('Must be boolean'),

  // Share URL
  shareUrl: z.string('Must be url').optional(),

  // Fit width
  fitWidth: z.boolean('Must be boolean'),

  // Need password
  needPassword: z.boolean('Must be boolean'),

  // onClose callback
  onClose: z.any(),

  // Document edit callback
  onEdit: z.any(),

  // Password validation callback
  onValidatePassword: z.any(),
}

const schemaParse = (options) => {
  const normalizedOptions = { ...options }
  if (
    normalizedOptions.content === undefined &&
    typeof normalizedOptions.html === 'string'
  ) {
    normalizedOptions.content = normalizedOptions.html
  }
  if ('html' in normalizedOptions) {
    delete normalizedOptions.html
  }

  const result = z.object(props).strict().safeParse(normalizedOptions)
  if (!result.success) {
    result.error.issues.forEach((item) => {
      throw new Error(`${item.path[0]} validation failed: ${item.message};`)
    })
  }
  return result.data
}

export { schemaParse, version }
