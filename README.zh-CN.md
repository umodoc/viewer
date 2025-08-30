<p style="text-align: center; margin: 2rem 0;">
<a href="https://www.umodoc.com" target="_blank"><img src="https://unpkg.com/@umoteam/editor-external@latest/static/logo.svg" alt="umodoc.com" width="280" /></a>
</p>

<p style="text-align: center;">
<a href="https://github.com/umodoc/viewer/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@umoteam/viewer" /></a>
<a href="https://www.npmjs.com/package/@umoteam/viewer" target="_blank"><img src="https://img.shields.io/npm/v/@umoteam/viewer" /></a>
<a href="https://www.npmjs.com/package/@umoteam/viewer" target="_blank"><img src="https://img.shields.io/npm/d18m/@umoteam/viewer" /></a>
<a href="https://www.npmjs.com/package/@umoteam/viewer" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/%40umoteam%2Fviewer" /></a>
<a href="https://github.com/umodoc/viewer/commits" target="_blank"><img src="https://img.shields.io/github/commit-activity/m/umodoc/viewer" /></a>
</p>
<p style="text-align: center;"><a href="https://dev.umodoc.com/en/docs/viewer">[English Documentation]</a> | 中文文档</p>

# 基本介绍

Umo Viewer 是一款 PDF 文档查看器，基于 Vue3 和 [PDF.js](https://github.com/mozilla/pdf.js) 实现，支持在浏览器中直接预览 PDF 文档，同时也支持预览 Umo Editor 文档内容。

Umo Viewer 是的诞生是为了解决[Umo Editor](https://github.com/umodoc/editor)文档的预览问题。在大部分的非编辑应用场景中，只需要显示文档内容而无需加载整个编辑器以提高加载速度，Umo Viewer 能与 [Umo Editor](https://github.com/umodoc/editor) 文档无缝集成并保持良好的兼容性。

[Umo Editor](https://github.com/umodoc/editor) 是一个基于 Vue3 和 Tiptap 的本土化开源文档编辑器，专为国人用户设计。它提供了强大的文档编辑能力和 AI 创作功能，支持分页模式和普通 Web 模式、Markdown 语法、富文本编辑、多种格式的节点插入、页面样式设置、文档导出与打印等功能。Umo Viewer 是 Umo Editor 的文档查看器，提供了与 Umo Editor 文档无缝集成的预览功能。

![Umo Viewer](https://s2.umodoc.com/images/umo-viewer-cn@2x.png)

## 在线体验

访问[https://www.umodoc.com/demo?target=viewer](https://www.umodoc.com/demo?target=viewer)快速体验。

## 开发文档

请访问[https://dev.umodoc.com/cn/docs/viewer](https://dev.umodoc.com/cn/docs/viewer)。

## 核心特性

- 支持 PDF 文档和 [Umo Editor](https://github.com/umodoc/editor) 文档的预览，可仅作为 PDF 文档查看器使用
- 支持输入密码解锁文档
- 丰富的自定义配置
- 支持多语言设置
- 支持自定义主题
- 支持自定义文档元信息
- 支持打印、导出 PDF 和分享
- 支持自动提取文档大纲或缩略图导航
- 支持缩放和自适应布局
- 支持在弹框中显示或者通过 Iframe 中嵌入
- 完全兼容 [Umo Editor](https://github.com/umodoc/editor) 文档内容

## 浏览器支持

| 浏览器                   |  版本  | 支持情况  |
| ------------------------ | :----: | :-------: |
| Google Chrome            | 最新版 |  ✅ 支持  |
| Firefox                  | 最新版 |  ✅ 支持  |
| Safari                   | 最新版 |  ✅ 支持  |
| Microsoft Edge           | 最新版 |  ✅ 支持  |
| 360 极速浏览器           | 最新版 |  ✅ 支持  |
| 各类国产浏览器的极速模式 | 最新版 |  ✅ 支持  |
| Internet Explorer (IE)   |  所有  | ❌ 不支持 |

## 环境支持

- **Node.js** (>=v18.0.0)
- **Vue** (>=v3.x)
- **Vite** (>=v4.x)

## 加入社区

我们鼓励用户加入 Umo Viewer 的开源社区，共同参与到产品的开发和改进中。无论是提交 Bug 报告、功能请求还是代码贡献，都是我们社区宝贵的一部分。

您可以通过 [GitHub Discussions](https://github.com/umodoc/viewer/discussions) 提交问题或意见。

或通过 [GitHub Issues](https://github.com/umodoc/viewer/issues) 提交 Bug 报告。

## 贡献代码

我们欢迎任何形式的贡献，包括但不限于提交 Bug 报告、功能请求、代码贡献等。

## 联系我们

如果您有任何疑问或建议，请通过以下方式联系我们。在此之前，建议您详细阅读本文档，以便了解如何使用 Umo Viewer。

- 反馈：[GitHub Issues](https://github.com/umodoc/viewer/issues)
- 社区：[GitHub Discussions](https://github.com/umodoc/viewer/discussions)
- 邮件：[contact@umodoc.com](mailto:contact@umodoc.com)

## 技术交流

- Umo Editor 技术交流1群：[994500039](https://qm.qq.com/cgi-bin/qm/qr?k=BH_TYEK3Om0BkN4VMT9TQLRvHzEhkUvp&jump_from=webapi&authKey=xIMvInBso7hjJHh8+44+8IMHhLjvpegQJC0wFtZRir76+vgrBFcw98FVoqCxV7XX)

## 支持我们

如果您觉得 Umo Viewer 有用，请考虑通过以下方式支持我们：

- ⭐ 给[Umo Viewer 仓库](https://github.com/umodoc/viewer)点个 Star，表示对项目的支持。
- 🔗 如果您在项目中使用了 Umo Viewer，请添加一个链接到 https://github.com/umodoc/viewer 。

## 开源协议

Umo Viewer 采用 [MIT 许可证](https://github.com/umodoc/viewer/raw/main/LICENSE)，您可以免费使用、修改和使用本软件，但这不代表您可以随意删除版权信息，请保留 Umo Viewer 的版权信息和界面上的链接地址，否则视为侵权，请支持开源项目。

本文档采用[CC BY-NC-SA 4.0 DEED 许可证](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)发布。
