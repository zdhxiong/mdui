After completing the [installation](/en/docs/2/getting-started/installation#npm) of mdui in Vue, you'll need to perform some additional configurations.

## Configuration {#configuration}

To prevent Vue from interpreting mdui components as Vue components, you'll need to adjust the `compilerOptions.isCustomElement` option in the `vite.config file`:

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Treat all tags starting with mdui- as mdui components
          isCustomElement: (tag) => tag.startsWith('mdui-')
        }
      }
    })
  ]
}
```

For more information, please refer to the [Vue official documentation](https://cn.vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue).

## Notes {#notes}

### Two-way Data Binding {#data-binding}

The `v-model` directive cannot be used for two-way data binding with mdui components. Instead, you'll need to manually manage data binding and updates. For example:

```html
<mdui-text-field
  :value="name"
  @input="name = $event.target.value"
></mdui-text-field>
```

### eslint Configuration {#eslint}

If you're using [`eslint-plugin-vue`](https://www.npmjs.com/package/eslint-plugin-vue), you'll need to add the following rule to your `.eslintrc.js`:

```js
rules: {
  'vue/no-deprecated-slot-attribute': 'off'
}
```
