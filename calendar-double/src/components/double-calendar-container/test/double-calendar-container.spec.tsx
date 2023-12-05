import { newSpecPage } from '@stencil/core/testing';
import { DoubleCalendarContainer } from '../double-calendar-container';

describe('double-calendar-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      html: `<double-calendar-container></double-calendar-container>`,
    });
    expect(page.root).toEqualHtml(`
      <double-calendar-container>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </double-calendar-container>
    `);
  });
});
