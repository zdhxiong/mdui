All mdui components support dark mode and can automatically switch themes based on the operating system's settings.

<style>
.dark-mode-light-visible,
.dark-mode-dark-visible {
  display: none;
}

.mdui-theme-light {
  .dark-mode-light-visible {
    display: inline-block;
  }
}
.mdui-theme-dark {
  .dark-mode-dark-visible {
    display: inline-block;
  }
}

@media (prefers-color-scheme: light) {
  .mdui-theme-auto .dark-mode-light-visible {
    display: inline-block;
  }
}
@media (prefers-color-scheme: dark) {
  .mdui-theme-auto .dark-mode-dark-visible {
    display: inline-block;
  }
}
</style>

Switch between light and dark themes by clicking the <mdui-icon class="dark-mode-light-visible" name="light_mode--outlined" style="vertical-align: middle"></mdui-icon><mdui-icon class="dark-mode-dark-visible" name="dark_mode--outlined" style="vertical-align: middle"></mdui-icon> icons in the top right corner of the documentation page. This allows you to preview component appearance in different themes.

To enable dark mode, add the `mdui-theme-dark` class to the `<html>` tag:

```html
<html class="mdui-theme-dark">

</html>
```

For automatic theme switching based on the operating system settings, use the `mdui-theme-auto` class:

```html
<html class="mdui-theme-auto">

</html>
```

You can apply different themes to different containers within a page. For example, the following example sets dark mode on the `<html>` tag, but a nested `<div>` uses the `mdui-theme-light` class. As a result, elements within this div display in light mode, while the rest of the page remains in dark mode:

```html
<html class="mdui-theme-dark">
  <body>
    <div class="mdui-theme-light">
      <!-- Elements in light mode here -->
    </div>

    <!-- Elements in dark mode here -->
  </body>
</html>
```

mdui also provides two functions for convenient theme manipulation:

* [`getTheme`](/en/docs/2/functions/getTheme): Retrieves the current theme on the entire page or a specified element.
* [`setTheme`](/en/docs/2/functions/setTheme): Applies a theme to the entire page or a specified element.

----

Note: mdui sets `color` and `background-color` styles on `:root`, `.mdui-theme-light`, `.mdui-theme-dark`, and `.mdui-theme-auto` selectors. If you prefer different styles, feel free to override these defaults.

For example, to set the background color to pure white and text color to pure black in light mode, and vice versa in dark mode, use the following CSS:

```css
:root,
.mdui-theme-light {
  color: #000;
  background-color: #fff;
}

.mdui-theme-dark {
  color: #fff;
  background-color: #000;
}

@media (prefers-color-scheme: dark) {
  .mdui-theme-auto {
    color: #fff;
    background-color: #000;
  }
}
```
