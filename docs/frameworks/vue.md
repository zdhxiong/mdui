在 Vue 中使用 mdui 时，按照 [安装](/docs/2/getting-started/installation#npm) 页面的介绍完成安装后，还需要进行一些配置。

## 配置 {#configuration}

你需要告诉 Vue 不要把 mdui 组件当成 Vue 组件来解析。在 `vite.config` 文件中设置 `compilerOptions.isCustomElement` 选项即可：

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 所有以 mdui- 开头的标签名都是 mdui 组件
          isCustomElement: (tag) => tag.startsWith('mdui-')
        }
      }
    })
  ]
}
```

<a href="https://cn.vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue" target="_blank" rel="nofollow">Vue 官方文档</a> 中也有详细介绍。

## 注意事项 {#notes}

### 双向数据绑定 {#data-binding}

在 mdui 组件上，你无法使用 `v-model` 进行双向数据绑定。你需要自行处理数据的绑定与更新。例如：

```html
<mdui-text-field
  :value="name"
  @input="name = $event.target.value"
></mdui-text-field>
```
