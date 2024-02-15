在 Vue 中使用 mdui 时，首先需要按照 [安装](/zh-cn/docs/2/getting-started/installation#npm) 页面的指引完成安装，然后进行一些必要的配置。

## 配置 {#configuration}

你需要配置 Vue，使其不将 mdui 组件解析为 Vue 组件。在 `vite.config` 文件中，设置 `compilerOptions.isCustomElement` 选项即可：

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

关于这个配置的详细信息，你可以参考 [Vue 官方文档](https://cn.vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue)。

## 注意事项 {#notes}

### 双向数据绑定 {#data-binding}

在 mdui 组件上，你不能使用 `v-model` 进行双向数据绑定。你需要自行处理数据的绑定与更新。例如：

```html
<mdui-text-field
  :value="name"
  @input="name = $event.target.value"
></mdui-text-field>
```
