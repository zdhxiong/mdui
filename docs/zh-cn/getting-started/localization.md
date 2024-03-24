mdui 内部默认使用英文，如果需要使用其他语言，则需要进行多语言配置。

## 使用方法 {#usage}

mdui 提供了三个函数来实现多语言功能：

* [`loadLocale`](/zh-cn/docs/2/functions/loadLocale)：加载语言包。参数为一个函数，接收一个语言代码作为参数，返回 Promise，当语言包加载完成时，Promise 被 resolve 为对应的语言包。请确保在项目的入口文件中调用该函数。
* [`setLocale`](/zh-cn/docs/2/functions/setLocale)：切换到指定的语言。参数为新的语言代码，返回 Promise，在新的语言包加载完成后 resolve。
* [`getLocale`](/zh-cn/docs/2/functions/getLocale)：获取当前的语言代码。

使用示例如下：

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
import { setLocale } from 'mdui/functions/setLocale.js';
import { getLocale } from 'mdui/functions/getLocale.js';

// 在项目入口处调用 loadLocale 加载语言包
loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));

// 在需要切换语言时调用该函数。在 Promise resolve 后，语言切换成功
setLocale('zh-cn').then(() => {
  // 调用 getLocale 可获取当前的语言代码
  console.log(getLocale()); // zh-cn
});
```

## 状态事件 {#event}

在语言切换的开始、结束、失败时，会在 `window` 上触发 `mdui-localize-status` 事件，你可以监听该事件来执行自定义操作，例如在语言切换成功后将语言代码写入 Cookie。

事件的 `detail.status` 属性描述了当前发生了何种状态的变更，可能的值包括：`loading`、`ready`、`error`：

<table>
  <thead>
    <tr>
      <th><code>detail.status</code></th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>loading</code></td>
      <td>
        <p>开始加载新的语言包。</p>
        <p><code>detail</code> 对象包含：</p>
        <ul>
          <li><code>loadingLocale</code>：新加载语言的语言代码。</li>
        <ul>
      </td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td>
        <p>新的语言包加载成功。</p>
        <p><code>detail</code> 对象包含：</p>
        <ul>
          <li><code>readyLocale</code>：新加载语言的语言代码。</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>error</code></td>
      <td>
        <p>新的语言包加载失败。</p>
        <p><code>detail</code> 对象包含：</p>
        <ul>
          <li><code>errorLocale</code>：加载失败的语言的语言代码。</li>
          <li><code>errorMessage</code>：加载失败的错误信息。</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

使用示例如下：

```js
window.addEventListener('mdui-localize-status', (event) => {
  if (event.detail.status === 'loading') {
    console.log(`开始加载新的语言包：${event.detail.loadingLocale}`);
  } else if (event.detail.status === 'ready') {
    console.log(`新语言包 ${event.detail.readyLocale} 加载成功`);
  } else if (event.detail.status === 'error') {
    console.error(`新语言包 ${event.detail.errorLocale} 加载失败：${event.detail.errorMessage}`);
  }
});
```

## 语言包加载方式 {#load-locale}

### 懒加载 {#lazy-load}

使用[动态导入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)可以在切换到对应语言时，才下载对应的语言包。这是最为推荐的方法。

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';

loadLocale((locale) => import(`../node_modules/mdui/locales/${locale}.js`));
```

### 预加载 {#pre-load}

在页面加载时，先下载好所有需要的语言包。这使得在切换语言时，无需再进行下载，从而使切换语言更加快速。

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';

const localizedTemplates = new Map([
  ['zh-cn', import(`../node_modules/mdui/locales/zh-cn.js`)],
  ['zh-tw', import(`../node_modules/mdui/locales/zh-tw.js`)]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

### 静态导入 {#static-imports}

使用该方法可以把所有需要的语言包和你的项目代码打包到同一个文件里，不再需要单独下载语言包。

```js
import { loadLocale } from 'mdui/functions/loadLocale.js';
import * as locale_zh_cn from 'mdui/locales/zh-cn.js';
import * as locale_zh_tw from 'mdui/locales/zh-tw.js';

const localizedTemplates = new Map([
  ['zh-cn', locale_zh_cn],
  ['zh-tw', locale_zh_tw]
]);

loadLocale(async (locale) => localizedTemplates.get(locale));
```

## 通过 CDN 加载语言包 {#cdn}

如果你是通过 CDN 来使用 mdui 的，可以直接从 CDN 加载语言包。使用示例如下：

```html
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>

<script>
mdui.loadLocale((locale) => import(`https://unpkg.com/mdui@2/locales/${locale}.js`));
mdui.setLocale('zh-cn');
</script>
```

## 支持的语言 {#languages}

目前，mdui 支持以下语言：

| 语言                 | 语言代码 |
| -------------------- | -------- |
| 阿拉伯语             | ar-eg    |
| 阿塞拜疆语           | az-az    |
| 保加利亚语           | bg-bg    |
| 孟加拉语（孟加拉国） | bn-bd    |
| 白俄罗斯语           | be-by    |
| 加泰罗尼亚语         | ca-es    |
| 捷克语               | cs-cz    |
| 丹麦语               | da-dk    |
| 德语                 | de-de    |
| 希腊语               | el-gr    |
| 英语                 | en-gb    |
| 英语（美式）         | en-us    |
| 西班牙语             | es-es    |
| 爱沙尼亚语           | et-ee    |
| 波斯语               | fa-ir    |
| 芬兰语               | fi-fi    |
| 法语（比利时）       | fr-be    |
| 法语（加拿大）       | fr-ca    |
| 法语（法国）         | fr-fr    |
| 爱尔兰语             | ga-ie    |
| 加利西亚语（西班牙） | gl-es    |
| 希伯来语             | he-il    |
| 印地语               | hi-in    |
| 克罗地亚语           | hr-hr    |
| 匈牙利语             | hu-hu    |
| 亚美尼亚             | hy-am    |
| 印度尼西亚语         | id-id    |
| 意大利语             | it-it    |
| 冰岛语               | is-is    |
| 日语                 | ja-jp    |
| 格鲁吉亚语           | ka-ge    |
| 高棉语               | km-kh    |
| 北库尔德语           | kmr-iq   |
| 卡纳达语             | kn-in    |
| 哈萨克语             | kk-kz    |
| 韩语/朝鲜语          | ko-kr    |
| 立陶宛语             | lt-lt    |
| 拉脱维亚语           | lv-lv    |
| 马其顿语             | mk-mk    |
| 马拉雅拉姆语         | ml-in    |
| 蒙古语               | mn-mn    |
| 马来语（马来西亚）   | ms-my    |
| 挪威语               | nb-no    |
| 尼泊尔语             | ne-np    |
| 荷兰语（比利时）     | nl-be    |
| 荷兰语               | nl-nl    |
| 波兰语               | pl-pl    |
| 葡萄牙语（巴西）     | pt-br    |
| 葡萄牙语             | pt-pt    |
| 罗马尼亚语           | ro-ro    |
| 俄罗斯语             | ru-ru    |
| 斯洛伐克语           | sk-sk    |
| 塞尔维亚语           | sr-rs    |
| 斯洛文尼亚语         | sl-si    |
| 瑞典语               | sv-se    |
| 泰米尔语             | ta-in    |
| 泰语                 | th-th    |
| 土耳其语             | tr-tr    |
| 乌尔都语（巴基斯坦） | ur-pk    |
| 乌克兰语             | uk-ua    |
| 越南语               | vi-vn    |
| 简体中文             | zh-cn    |
| 繁体中文（中国香港） | zh-hk    |
| 繁体中文（中国台湾） | zh-tw    |

## 提交新的翻译 {#contribute}

要贡献新的翻译、或对现有翻译进行改进，请在 Github 上发起一个 Pull Request。语言包位于 [`packages/mdui/src/xliff`](https://github.com/zdhxiong/mdui/tree/v2/packages/mdui/src/xliff)，你可以直接在 Github 上进行编辑。
