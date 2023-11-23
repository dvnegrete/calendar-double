import { newSpecPage } from '@stencil/core/testing';
import { CalendarDouble } from '../calendar-double';

describe('calendar-double', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      html: `<calendar-double></calendar-double>`,
    });
    expect(page.root).toEqualHtml(`
      <calendar-double>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </calendar-double>
    `);
  });
});
