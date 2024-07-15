mdui is built with browser-native Web Components, making it compatible with all web frameworks. Here are ways to use mdui with popular frameworks.

## Aurelia {#Aurelia}

After completing the [installation](/en/docs/2/getting-started/installation#npm) of mdui, you'll need to install and configure an additional package (Aurelia 2 only):

```bash
npm install aurelia-mdui --save
```

and connect it to your application:

```typescript
import { MduiWebTask } from 'aurelia-mdui';

Aurelia
  .register(MduiWebTask)
  .app(MyApp)
  .start();
```

**Notes**

Please send bug reports to [https://github.com/mreiche/aurelia-mdui](https://github.com/mreiche/aurelia-mdui)

## WebCell {#WebCell}

To integrate mdui with [WebCell](https://web-cell.dev/), start by following the steps on the [installation](/en/docs/2/getting-started/installation#npm) page, first-class Web components, TypeScript & JSX supports is out of box.

Or you can create a new project with [the official GitHub template repository](https://github.com/EasyWebApp/WebCell-mobile) by [clicking only one button](https://github.com/new?template_name=WebCell-mobile&template_owner=EasyWebApp).
