# MCP Server

mdui provides a dedicated [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, `@mdui/mcp`, that lets AI agents query local information about components, icons, CSS variables, and documentation.

It integrates with developer tools like Claude Code, Cursor, and GitHub Copilot to help you use mdui components and styles correctly.

## Tools {#tools}

The mdui MCP server exposes the following tools to AI agents:

- `list_components`: List all mdui components.
- `get_component_metadata`: Get detailed API metadata for a single component.
- `list_css_classes`: List global CSS class names.
- `list_css_variables`: List global CSS variables.
- `list_documents`: List all documentation entries.
- `get_document`: Get the full content of a single document.
- `list_icon_codes`: List icon codes for attributes or APIs.
- `list_icon_components`: List standalone icon components and their ESM import statements.

## How to use {#usage}

This server supports only the stdio transport (see MCP spec: https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio). It works directly with VS Code, Cursor, Claude Code, Windsurf, Zed, and other clients, as well as AI agents that support MCP over stdio.

### VS Code {#vscode}

> Make sure you have both the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions installed.

1. Create `.vscode/mcp.json` at the project root with the following content:

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

2. Click the "Start" button that appears in the `mcp.json` file.
3. Start a conversation in GitHub Copilot Chat.

### Cursor {#cursor}

1. Create or edit `.cursor/mcp.json` at the project root and add:

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

2. Go to Settings > Cursor Settings > MCP & Integrations and enable the mdui server.
3. Start a chat in Cursor.

### Claude Code {#claude-code}

1. In your terminal, add the mdui MCP server:

   ```bash
   claude mcp add mdui -- npx -y @mdui/mcp
   ```

2. Then run `claude` to start a session.
3. Enter your prompts to start interacting with the server.

### Windsurf {#windsurf}

1. Open Settings > Windsurf Settings > Cascade.
2. Click "Manage MCPs", then "View raw config", and add:

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

   > If the MCP server does not appear automatically, click Refresh to reload the list.

3. Enter your prompts to start a conversation.

### Zed {#zed}

1. Open Settings > Open Settings, then add the following to `settings.json`:

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

2. Start prompting to use the server.

### Custom MCP clients {#custom}

When using a custom MCP client locally or in a dev environment, add the server to your client configuration. For example:

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
