# LLMs.txt

mdui 提供了 `llms.txt` 与 `llms-full.txt`，用于为 LLM（大语言模型）提供准确、可引用的上下文，帮助 AI 更可靠地回答 mdui 相关问题。

## 使用 llms.txt 为 AI 提供上下文 {#context}

两个入口：

- `llms.txt`：https://www.mdui.org/zh-cn/docs/2/llms.txt
- `llms-full.txt`：https://www.mdui.org/zh-cn/docs/2/llms-full.txt

`llms.txt` 是精简索引，适合供可联网的模型按链接抓取所需 Markdown 页面，或先提供项目概览。

`llms-full.txt` 含完整上下文，包含 `llms.txt` 中的所有页面内容，适合模型无法联网或需一次性提供完整上下文。

## 文档的 Markdown 版本 {#md-mirror}

每个文档页面都提供了对应的 Markdown 版本：在页面 URL 末尾追加 `.md` 即可（首页追加 `index.md`）。

例如：

    https://www.mdui.org/zh-cn/docs/2/components/button → https://www.mdui.org/zh-cn/docs/2/components/button.md
    https://www.mdui.org/zh-cn/docs/2/ → https://www.mdui.org/zh-cn/docs/2/index.md

可直接把该 Markdown 链接或其纯文本作为上下文，获得更聚焦、准确的回答。

## 在 ChatGPT、Claude 等 LLM 中如何使用 {#how-to-use}

根据模型是否支持联网/文件上传，选择以下一种或组合使用：

1. 直接粘贴：将 `llms-full.txt` 的内容作为系统提示或首条消息。

   示例：“以下是 mdui 的上下文。请严格依据它回答后续问题；若有冲突，以该上下文为准：\n\n[粘贴 llms-full.txt 内容]”。

2. 上传文件：上传 `llms-full.txt`（或 `llms.txt`），并在首条提示说明“以附件为主要上下文”。

   示例：“基于附件中的 mdui 文档，给出 `<mdui-button>` 的用法与常见坑”。

3. 在线读取：在对话中给出 `llms.txt` 或 `llms-full.txt` 的链接。

   示例：“请读取并遵循 https://www.mdui.org/zh-cn/docs/2/llms-full.txt 作为上下文，回答我关于 mdui 的问题”。

4. 指向具体页面：只讨论特定组件/函数时，直接给出该页面的 Markdown 地址。

   示例：“请阅读 https://www.mdui.org/zh-cn/docs/2/components/button.md ，并基于该文档给出三段最佳实践”。

**提示**：可点击页面右上角的 <mdui-icon name="auto_awesome"></mdui-icon> 图标，支持一键复制上述链接、打开当前页面的 Markdown 版本，或将当前页面或 `llms-full.txt` 作为上下文在 ChatGPT 中打开。
