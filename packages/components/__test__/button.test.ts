import { expect, fixture, html } from '@open-wc/testing';
import { Button } from '../button.js';

interface ButtonProps {
  disabled: boolean;
  href: string;
  download: string;
  target: string;
  rel: string;
  autofocus: boolean;
  name: string;
  value: string;
  type: string;
  form: string;
  formAction: string;
  formEnctype: string;
  formMethod: string;
  formNovalidate: boolean;
  formTarget: string;
  loading: boolean;
  variant: string;
  fullwidth: boolean;
  icon: string;
  iconVariant: string;
  trailingIcon: boolean;
}

describe('mdui-button', () => {
  it('default', async () => {
    const el = await fixture<Button>(html`<mdui-button>Button</mdui-button>`);

    expect(el.textContent).to.equal('Button');
  });
});
