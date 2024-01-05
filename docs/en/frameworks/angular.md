To utilize mdui in Angular, you must first complete the [installation](/en/docs/2/getting-started/installation#npm) of mdui. Following this, additional configuration is required.

## Configuration {#configuration}

The first step is to enable the use of Web Components in Angular. This can be achieved by adding the `CUSTOM_ELEMENTS_SCHEMA` to the `schemas` array in your module.

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

Once this is set up, you can import mdui components into your Angular component code.

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

  // Use @ViewChild to get a reference to the #dialog element
  @ViewChild('dialog')
  dialog?: ElementRef<Dialog>;

  ...

  constructor(...) {
  }

  ngOnInit() {
  }

  ...

  openDialog() {
    // Use nativeElement to access the mdui component
    this.dialog?.nativeElement.open = true;
  }
}
```
