# Integrate with Other Frameworks

mdui is built with browser-native Web Components, making it compatible with all web frameworks. Here are a few ways to use mdui with popular frameworks.

## Aurelia {#Aurelia}

After completing the [installation](/en/docs/2/getting-started/installation#npm) of mdui, you'll need to install and configure an additional package (Aurelia 2 only):

```bash
npm install aurelia-mdui --save
```

Then connect it to your application:

```typescript
import { MduiWebTask } from 'aurelia-mdui';

Aurelia.register(MduiWebTask).app(MyApp).start();
```

**Notes**

Report bugs at [https://github.com/mreiche/aurelia-mdui](https://github.com/mreiche/aurelia-mdui)

## WebCell {#WebCell}

To integrate mdui with [WebCell](https://web-cell.dev/), start by following the steps on the [installation](/en/docs/2/getting-started/installation#npm) page. Web Components, TypeScript, and JSX support are first-class and available out of the box.

Or you can create a new project with [the official GitHub template repository](https://github.com/EasyWebApp/WebCell-mobile) with [one click](https://github.com/new?template_name=WebCell-mobile&template_owner=EasyWebApp).
