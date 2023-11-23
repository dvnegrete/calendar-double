import { newSpecPage } from '@stencil/core/testing';
import { HeaderCalendar } from '../header-calendar';

describe('header-calendar', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      html: `<header-calendar></header-calendar>`,
    });
    expect(page.root).toEqualHtml(`
      <header-calendar>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </header-calendar>
    `);
  });
});
