import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ArrowLeftChevron } from '../arrow-left-chevron';

describe('arrow-left-chevron', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ArrowLeftChevron],
      html: `<arrow-left-chevron></arrow-left-chevron>`,
    });
    expect(page.root).toEqualLightHtml(`
      <arrow-left-chevron></arrow-left-chevron>
    `);
  });

  it('should have class inactive', async () => {
    const page = await newSpecPage({
      components: [ArrowLeftChevron],
      template: ()=> (
        <arrow-left-chevron 
          inactive = { true }
        />
      ),
    });
    const svgElement = page.root.shadowRoot.querySelector('svg') as Element;
    expect(svgElement.classList.contains('inactive')).toBeTruthy();    
  });
});
