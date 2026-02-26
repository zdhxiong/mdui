# MCP 服务器

mdui 提供专用的 [MCP（Model Context Protocol）](https://modelcontextprotocol.io/) 服务器 `@mdui/mcp`，用于在本地为 AI 智能体提供组件、图标、CSS 自定义属性和文档的查询能力。

它可与 Claude Code、Cursor、GitHub Copilot 等开发工具配合，辅助生成代码，并更好地使用 mdui 的组件与样式。

## 工具 {#tools}

mdui 的 MCP 服务器向 AI 智能体暴露以下工具：

- `list_components`：列出全部 mdui 组件。
- `get_component_metadata`：获取单个组件的详细 API 元数据。
- `list_css_classes`：列出全局 CSS 类名。
- `list_css_variables`：列出全局 CSS 自定义属性。
- `list_documents`：列出所有文档。
- `get_document`：获取单个文档的完整内容。
- `list_icon_codes`：列出可用于属性或 API 的图标代码。
- `list_icon_components`：列出独立的图标组件及其 ESM 导入语句。

## 使用方式 {#usage}

MCP 服务器仅支持 [stdio 传输](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio)，可在 VS Code、Cursor、Claude Code、Windsurf、Zed 等客户端，以及支持 stdio 协议的 AI 智能体中直接使用。

### VS Code {#vscode}

> 确保已安装 [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) 与 [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) 扩展。

1. 在项目根目录创建 `.vscode/mcp.json`，添加以下配置：

   ```json
   {
     "servers": {
       "mdui": {
         "command": "npx",
         "args": ["-y", "@mdui/mcp"]
       }
     }
   }
   ```

2. 点击 `mcp.json` 文件中的“启动”按钮。
3. 在 GitHub Copilot Chat 中开始对话。

### Cursor {#cursor}

1. 在项目根目录创建或编辑 `.cursor/mcp.json`，添加以下配置：

   ```json
   {
     "mcpServers": {
       "mdui": {
         "command": "npx",
         "args": ["-y", "@mdui/mcp"]
       }
     }
   }
   ```

2. 进入 Settings > Cursor Settings > MCP & Integrations，启用 mdui 服务器。
3. 在 Cursor Chat 中开始对话。

### Claude Code {#claude-code}

1. 在终端中运行以下命令添加 mdui MCP 服务器：

   ```bash
   claude mcp add mdui -- npx -y @mdui/mcp
   ```

2. 随后运行 `claude` 启动会话。
3. 输入提示词开始使用。

### Windsurf {#windsurf}

1. 前往 Settings > Windsurf Settings > Cascade
2. 点击 Manage MCPs，再点击 “View raw config”，在配置文件中添加：

   ```json
   {
     "mcpServers": {
       "mdui": {
         "command": "npx",
         "args": ["-y", "@mdui/mcp"]
       }
     }
   }
   ```

   > 如 MCP 服务器未自动出现，可点击 Refresh 刷新列表。

3. 输入提示词开始对话。

### Zed {#zed}

1. 打开 Settings > Open Settings，在 `settings.json` 文件中添加以下配置：

   ```json
   {
     "context_servers": {
       "mdui": {
         "source": "custom",
         "command": "npx",
         "args": ["-y", "@mdui/mcp"]
       }
     }
   }
   ```

2. 输入提示词开始使用。

### 自定义 MCP 客户端 {#custom}

在本地或开发环境中使用自定义 MCP 客户端时，将该服务器添加到客户端的配置文件即可。例如：

```json
{
  "mcpServers": {
    "mdui": {
      "command": "npx",
      "args": ["-y", "@mdui/mcp"]
    }
  }
}
```
