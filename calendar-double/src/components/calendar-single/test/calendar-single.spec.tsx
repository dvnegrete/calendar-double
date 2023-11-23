import { newSpecPage } from '@stencil/core/testing';
import { CalendarSingle } from '../calendar-single';

describe('calendar-single', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      html: `<calendar-single></calendar-single>`,
    });
    expect(page.root).toEqualHtml(`
      <calendar-single>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </calendar-single>
    `);
  });
});
