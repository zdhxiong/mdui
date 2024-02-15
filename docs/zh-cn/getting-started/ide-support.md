mdui 专门为 VS Code 和 WebStorm 进行了优化，在这些 IDE 中可以获得代码自动完成、悬停提示等功能。

<style>
.ide-support-icon {
  user-select: none;
  font-size: 1rem;
}
</style>

## VS Code {#vscode}

### 通过 npm 安装的 mdui {#vscode-npm}

如果你通过 npm 安装了 mdui，可以按照以下步骤在当前项目中启用 VS Code 的 IDE 支持：

1. 在项目的根目录中创建 `.vscode` 目录。
2. 在 `.vscode` 目录中创建 `settings.json` 文件。
3. 将以下代码添加到 `settings.json` 文件中：
    ```json
    {
      "html.customData": ["./node_modules/mdui/html-data.zh-cn.json"],
      "css.customData": ["./node_modules/mdui/css-data.zh-cn.json"]
    }
    ```

如果 `settings.json` 文件已经存在，只需将上述两行代码添加到 JSON 文档的根节点即可。修改完成后，重启 VS Code。

### 通过 CDN 使用的 mdui {#vscode-cdn}

如果你是通过 CDN 引入的 mdui，可以通过安装 mdui 的 VS Code 扩展来获得 IDE 支持。

在 VS Code 的扩展商店中搜索 `mdui`，选择第一条搜索结果进行安装，或者[点击此处安装](vscode:extension/zdhxiong.mdui)。安装完成后，所有项目都将启用 mdui 的 IDE 支持。

建议优先通过 npm 安装并设置 `settings.json` 文件，而非安装 VS Code 扩展，以确保 IDE 支持与当前使用的 mdui 版本保持一致。

## WebStorm {#webstorm}

### 通过 npm 安装的 mdui {#webstorm-npm}

如果你通过 npm 安装了 mdui，可以按照以下步骤在当前项目中启用 WebStorm 的 IDE 支持：

1. 在项目根目录的 `package.json` 文件的根节点中添加以下代码：
    ```
    web-types: ["./node_modules/mdui/web-types.zh-cn.json"]
    ```

如果 `package.json` 文件的根节点已存在 `web-types` 属性，只需将 `./node_modules/mdui/web-types.zh-cn.json` 添加到 `web-types` 数组中即可。修改完成后，重启 WebStorm。

### 通过 CDN 使用的 mdui {#webstorm-cdn}

如果你是通过 CDN 引入的 mdui，可以通过安装 mdui 的 WebStorm 插件来获得 IDE 支持。

在 WebStorm 的插件市场中搜索 `mdui`，选择第一条搜索结果进行安装。安装完成后，所有项目都将启用 mdui 的 IDE 支持。

建议优先通过 npm 安装来获取 IDE 支持，而非安装 WebStorm 插件，以确保 IDE 支持与当前使用的 mdui 版本保持一致。

## 对 VS Code 和 WebStorm 支持的差异 {#difference}

mdui 对 VS Code 和 WebStorm 的支持存在一些差异。以下表格列出了详细的差异：

| 具有代码自动完成及悬浮提示的位置         | VS Code                                                                | WebStorm                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| HTML 标签名                              | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
| HTML 标签中的属性名                      | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
| HTML 标签中属性值的枚举值                | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>（不支持显示枚举值的注释）          |
| HTML 标签中的事件名                      |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
| HTML 中 slot 的 `name` 属性值            |                                                                        |                                                                                                           |
| CSS 中 `::part()` 选择器的 `part` 属性名 |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>（需要 WebStorm 2023.2 及以上版本） |
| CSS 中组件内的 CSS 自定义属性名          |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
| CSS 中的全局 CSS 自定义属性名            | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
| CSS 中的全局 class 名                    |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                    |
