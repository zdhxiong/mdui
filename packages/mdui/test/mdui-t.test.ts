import { html, fixture, expect } from '@open-wc/testing';

import { MduiT } from '../src/MduiT.js';
import '../mdui-t.js';

describe('MduiT', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<MduiT>(html`<mdui-t></mdui-t>`);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<MduiT>(html`<mdui-t></mdui-t>`);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<MduiT>(html`<mdui-t title="attribute title"></mdui-t>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<MduiT>(html`<mdui-t></mdui-t>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
