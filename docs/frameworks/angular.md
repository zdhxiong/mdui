在 Angular 中使用 mdui 时，按照 [安装](/docs/2/getting-started/installation#npm) 页面的介绍完成安装后，还需要进行一些配置。

## 配置 {#configuration}

设置允许在 Angular 中使用 Web Components。如下示例：

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

然后就能在 Angular 组件代码中引入 mdui 组件了：

```js
import { Dialog } from 'mdui/components/dialog.js';

@Component({
  selector: 'app-dialog-example',
  template: `<div id="page">
    <button (click)="openDialog()">Open Dialog</button>
    <mdui-dialog #dialog primary="Dialog Title">Dialog Content</mdui-dialog>
  </div>`
})
export class DialogExampleComponent implements OnInit {

  // 使用 @ViewChild 获取 #dialog 元素的引用
  @ViewChild('dialog')
  dialog?: ElementRef<Dialog>;

  ...

  constructor(...) {
  }

  ngOnInit() {
  }

  ...

  openDialog() {
    // 使用 nativeElement 访问 mdui 组件
    this.dialog?.nativeElement.open = true;
  }
}
```
