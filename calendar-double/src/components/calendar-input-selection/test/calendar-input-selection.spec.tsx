import { newSpecPage } from '@stencil/core/testing';
import { CalendarInputSelection } from '../calendar-input-selection';

describe('calendar-input-selection', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CalendarInputSelection],
      html: `<calendar-input-selection></calendar-input-selection>`,
    });
    expect(page.root).toEqualHtml(`
      <calendar-input-selection>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </calendar-input-selection>
    `);
  });
});
