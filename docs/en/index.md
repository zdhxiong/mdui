> You are currently reading the documentation for mdui 2!
>
> For mdui 1 documentation, please visit [www.mdui.org/docs/](https://www.mdui.org/docs/).

Let's begin by incorporating mdui into a basic page template using a CDN.

## Getting Started {#getting-started}

To use mdui, import the CSS and JS files from the CDN.

For npm installation instructions, refer to the [Installation](/en/docs/2/getting-started/installation) section.

**Importing Files**

Add the following lines to your page's `<head>` tag:

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>
```

To utilize the icon attribute (for example, `icon="search"` in `<mdui-button icon="search"></mdui-button>`), include the CSS file for the icon. Refer to [Using Material Icons](/en/docs/2/components/icon#usage-material-icons) for more information.

mdui operates independently of third-party libraries and is ready to use once the files are included.

## Simplest Page Template {#template}

Below is the simplest page template. You can add more components and content to build your website.

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"/>
    <meta name="renderer" content="webkit"/>

    <link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">
    <script src="https://unpkg.com/mdui@2/mdui.global.js"></script>
    <!-- Include the icon's CSS file if using the icon attribute -->

    <title>Hello, world!</title>
  </head>
  <body>
    <mdui-button>Hello, world!</mdui-button>
  </body>
</html>
```
