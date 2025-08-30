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
<p style="text-align: center;">English Documentation | <a href="https://dev.umodoc.com/cn/docs/viewer">[中文文档]</a></p>

# 中文介绍

Umo Viewer 是一款 PDF 文档查看器，基于 Vue3 和 [PDF.js](https://github.com/mozilla/pdf.js) 实现，支持在浏览器中直接预览 PDF 文档，同时也支持预览 Umo Editor 文档内容。

Umo Viewer 是的诞生是为了解决 [Umo Editor](https://github.com/umodoc/editor) 文档的预览问题。在大部分的非编辑应用场景中，只需要显示文档内容而无需加载整个编辑器以提高加载速度，Umo Viewer 能与 [Umo Editor](https://github.com/umodoc/editor) 文档无缝集成并保持良好的兼容性。

[Umo Editor](https://github.com/umodoc/editor) 是一个基于 Vue3 和 Tiptap 的本土化开源文档编辑器，专为国人用户设计。它提供了强大的文档编辑能力和 AI 创作功能，支持分页模式和普通 Web 模式、Markdown 语法、富文本编辑、多种格式的节点插入、页面样式设置、文档导出与打印等功能。Umo Viewer 是 Umo Editor 的文档查看器，提供了与 Umo Editor 文档无缝集成的预览功能。

# Introduction

Umo Viewer is a PDF document viewer built with Vue3 and [PDF.js](https://github.com/mozilla/pdf.js). It supports previewing PDF documents directly in the browser and also supports previewing Umo Editor document content.

Umo Viewer was created to solve the preview problem for [Umo Editor](https://github.com/umodoc/viewer) documents. In most non-editing scenarios, you only need to display document content without loading the entire editor, which improves loading speed. Umo Viewer integrates seamlessly with [Umo Editor](https://github.com/umodoc/viewer) documents and maintains great compatibility.

[Umo Editor](https://github.com/umodoc/viewer) is an open-source document editor based on Vue3 and Tiptap. It provides powerful document editing capabilities and AI-assisted creation features. Umo Editor supports pagination and normal web layout, Markdown syntax, rich text editing, insertion of various node types, page style settings, document export, and printing. Additionally, it supports custom extensions, multi-language settings, and a dark theme. Umo Editor also supports web layout, and you can use it as a regular rich text editor. Umo Viewer is a document viewer for Umo Editor, providing seamless integration with Umo Editor documents and preview features.

![Umo Viewer](https://s2.umodoc.com/images/umo-viewer-en@2x.png)

## Online Experience

Visit [https://www.umodoc.com/demo?target=viewer](https://www.umodoc.com/demo?target=viewer) for a quick demo.

## Documentation

See [https://dev.umodoc.com/en/docs/viewer](https://dev.umodoc.com/en/docs/viewer).

## Key Features

- Support for previewing PDF documents and [Umo Editor](https://github.com/umodoc/editor) documents, can be used solely as a PDF document viewer
- Password protection for documents
- Extensive customization options
- Multi-language support
- Custom themes
- Custom document metadata
- Print, export PDF, and share
- Automatic outline extraction and thumbnail navigation
- Zoom and responsive layout
- Display in modal dialogs or embed via iframe
- Fully compatible with [Umo Editor](https://github.com/umodoc/editor) document content

## Browser Support

| Browser                | Version | Support |
| ---------------------- | ------- | :-----: |
| Google Chrome          | Latest  |   ✅    |
| Firefox                | Latest  |   ✅    |
| Safari                 | Latest  |   ✅    |
| Microsoft Edge         | Latest  |   ✅    |
| Internet Explorer (IE) | All     |   ❌    |

## Environment Support

- **Node.js** (>=v18.0.0)
- **Vue** (>=v3.x)
- **Vite** (>=v4.x)

## Join the Community

We encourage users to join the Umo Viewer open-source community and participate in the development and improvement of the product. Whether it's submitting bug reports, feature requests, or code contributions, your involvement is invaluable to our community.

Submit issues or suggestions via [GitHub Discussions](https://github.com/umodoc/viewer/discussions).

Report bugs via [GitHub Issues](https://github.com/umodoc/viewer/issues).

## Contributing

We welcome all forms of contributions, including but not limited to submitting bug reports, feature requests, and code contributions.

## Contact Us

If you have any questions or suggestions, please contact us through the following channels. Before doing so, we recommend reading this documentation thoroughly to understand how to use Umo Viewer.

- Feedback: [GitHub Issues](https://github.com/umodoc/viewer/issues)
- Community: [GitHub Discussions](https://github.com/umodoc/viewer/discussions)
- Email: [contact@umodoc.com](mailto:contact@umodoc.com)

## Support Us

If you find Umo Viewer useful, please consider supporting us in the following ways:

- ⭐ Star the [Umo Viewer repository](https://github.com/umodoc/viewer) to show your support.
- 🔗 If you use Umo Viewer in your project, add a link to https://github.com/umodoc/viewer.

## Open Source License

Umo Viewer is licensed under the [MIT License](https://github.com/umodoc/viewer/raw/main/LICENSE). You are free to use, modify, and distribute this software, but this does **not** mean you are allowed to remove the copyright information at will. Please retain the Umo Viewer copyright notice and the link displayed in the interface. Removal of these will be considered an infringement. We encourage you to support open-source projects.

This documentation is published under the [CC BY-NC-SA 4.0 DEED License](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en).
