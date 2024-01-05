mdui is optimized for VS Code and WebStorm, offering features such as code autocompletion and hover hints.

<style>
.ide-support-icon {
  user-select: none;
  font-size: 1rem;
}
</style>

## VS Code {#vscode}

### For npm-installed mdui {#vscode-npm}

If you've installed mdui via npm, you can enable VS Code IDE support for your project by following these steps:

1. Create a `.vscode` directory at your project root.
2. Inside the `.vscode` directory, create a `settings.json` file.
3. Add the following code to `settings.json`:
    ```json
    {
      "html.customData": ["./node_modules/mdui/html-data.en.json"],
      "css.customData": ["./node_modules/mdui/css-data.en.json"]
    }
    ```

If `settings.json` already exists, simply add the above lines to the root of the JSON document. Restart VS Code after making these changes.

### For mdui Used via CDN {#vscode-cdn}

If you're using mdui through a CDN, you can install the mdui VS Code extension for IDE support.

Search for `mdui` in the VS Code extension marketplace, select the first result and install it, or [click here to install](vscode:extension/zdhxiong.mdui). This will enable mdui IDE support for all projects.

Prioritize npm installation and `settings.json` setup over the VS Code extension to ensure IDE support aligns with the mdui version in use.

WebStorm {#webstorm}

## WebStorm {#webstorm}

### For npm-installed mdui {#webstorm-npm}

To enable WebStorm IDE support for mdui installed via npm:

1. Add the following code to the root of your project's `package.json` file:
    ```
    web-types: ["./node_modules/mdui/web-types.en.json"]
    ```

If `package.json` already has a `web-types` property, add `./node_modules/mdui/web-types.en.json` to the `web-types` array. Restart WebStorm after these changes.

### For mdui Used via CDN {#webstorm-cdn}

If you're using mdui through a CDN, you can install the mdui WebStorm plugin for IDE support.

Search for `mdui` in the WebStorm plugin marketplace, select the first result and install it. This will enable mdui IDE support for all projects.

Prioritize npm installation and `package.json` setup over the WebStorm plugin to ensure IDE support aligns with the mdui version in use.

## Differences in VS Code and WebStorm Support {#difference}

mdui support varies between VS Code and WebStorm. The table below details the differences:

| Code Autocompletion and Hover Hints Location            | VS Code                                                                | WebStorm                                                                                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| HTML tag names                                          | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
| Attribute names within HTML tags                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
| Enumeration values within HTML tag attributes           | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> (Does not support displaying enumeration value comments) |
| Event names within HTML tags                            |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
| `name` attribute values within HTML slots               |                                                                        |                                                                                                                                 |
| `part` attribute names within CSS `::part()` selectors  |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> (Requires WebStorm 2023.2 or later)                      |
| CSS custom property names within component-specific CSS |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
| Global CSS custom property names                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon> | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
| Global CSS class names                                  |                                                                        | <mdui-icon name="check--rounded" class="ide-support-icon"></mdui-icon>                                                          |
