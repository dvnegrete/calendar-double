import { newSpecPage } from '@stencil/core/testing';
import { HeaderCalendar } from '../header-calendar';
import { h } from '@stencil/core';

describe('header-calendar', () => {
    
  it('renders', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      html: `<header-calendar></header-calendar>`,
    });
    expect(page.root).toEqualHtml(`
      <header-calendar>
        <mock:shadow-root>
          <header>
            <div class="empty"></div>
            <span></span>
            <div class="empty"></div>
          </header>
        </mock:shadow-root>
      </header-calendar>
    `);
  });
  
  it('render with twoArrow=true', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      template: ()=> (<header-calendar two-arrow="true"/>),
    });
    expect(page.root).toEqualHtml(`
    <header-calendar two-arrow="true">
        <mock:shadow-root>
          <header>
            <div class="button-next">
              <arrow-left-chevron/>
            </div>
            <span></span>
              <div class="button-next">
                <arrow-left-chevron rotation="180"/>
              </div>
          </header>
        </mock:shadow-root>
      </header-calendar>
    `);
  });
 
  it('render with twoArrow=true and nameInactive=true', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      template: ()=> (<header-calendar two-arrow="true" name-inactive="true"/>),
    });
    expect(page.root).toEqualHtml(`
    <header-calendar two-arrow="true" name-inactive="true">
        <mock:shadow-root>
          <header>
            <div class="button-next hidden">
              <arrow-left-chevron inactive=""/>
            </div>
            <span class="inactive"></span>
              <div class="button-next hidden">
                <arrow-left-chevron rotation="180" inactive=""/>
              </div>
          </header>
        </mock:shadow-root>
      </header-calendar>
    `);
  });

  it('should events capture previousMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      template: ()=> (<header-calendar two-arrow="true"/>),
    });
    const component = page.rootInstance as HeaderCalendar;
    const emitSpy = jest.spyOn(component.previousMonthCalendar, 'emit');
    const button = page.root.shadowRoot.querySelector('.button-next') as HTMLElement;
    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });
  
  it('should events capture nextMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [HeaderCalendar],
      template: ()=> (<header-calendar position="right"/>),
    });
    const component = page.rootInstance as HeaderCalendar;
    const emitSpy = jest.spyOn(component.nextMonthCalendar, 'emit');
    const button = page.root.shadowRoot.querySelector('.button-next') as HTMLElement;
    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });
 
});
