import { z } from 'zod'

import { version } from '../../package.json'

const props = {
  // Language
  lang: z.literal(['zh-CN', 'en-US'], 'Must be zh-CN or en-US'),

  // Theme
  theme: z.literal(['light', 'dark', 'auto'], 'Must be light, dark or auto'),

  // Preview mode
  mode: z
    .literal(['html', 'pdf'], 'Must be html or pdf')
    .array('Must be array'),

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

  // Show header
  showHeader: z.boolean('Must be boolean'),

  // Show aside
  showAside: z.boolean('Must be boolean'),

  // Edit URL
  editable: z.boolean('Must be boolean').optional(),

  // Printable
  printable: z.boolean('Must be boolean'),

  // Downloadable
  downloadable: z.boolean('Must be boolean'),

  // Closeable
  closeable: z.boolean('Must be boolean'),

  // Share URL
  shareUrl: z.string('Must be url').optional(),

  // Page content
  html: z.string('Must be string').nonempty('Cannot be empty'),
  pdf: z.string('Must be url').optional(),

  // Show multi-column
  showMultiPage: z.boolean('Must be boolean'),

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
  const result = z.object(props).safeParse(options)
  if (!result.success) {
    result.error.issues.forEach((item) => {
      throw new Error(`${item.path[0]} validation failed: ${item.message};`)
    })
  }
  return result.data
}

export { schemaParse, version }
