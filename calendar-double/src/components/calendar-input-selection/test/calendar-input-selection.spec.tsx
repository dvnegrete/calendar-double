import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CalendarInputSelection } from '../calendar-input-selection';

describe('calendar-input-selection', () => {

  it('should call @Listen dvn-arrayDatesSelected', async () => {
    const page = await newSpecPage({
      components: [CalendarInputSelection],
      template: ()=> (<calendar-input-selection/>),
    });
    const component = page.rootInstance as CalendarInputSelection;
    const handlerDatesSelectedSpy = jest.spyOn(component, 'handlerDatesSelected');
    
    /**
     * @param type: oneDay
     * [date:<Date>]
     */
    const paramDate = [new Date];
    page.root.dispatchEvent(new CustomEvent('dvn-arrayDatesSelected', {detail: paramDate}));
    await page.waitForChanges();
    
    /**
     * @param type: range
     * [firstDate:<Date>, lastDate:<Date>]
     */
    const paramRange = [new Date(2023,1,1), new Date(2023,1,10)];
    page.root.dispatchEvent(new CustomEvent('dvn-arrayDatesSelected', {detail: paramRange}));
    await page.waitForChanges();
    
    /**
     * @param type: period
     * [firstDate:<Date>, lastDate:<Date>, date:<string>]
     */
    const paramPeriod = [new Date(2023,1,1), new Date(2023,1,10), 'Febrero 2023'];
    page.root.dispatchEvent(new CustomEvent('dvn-arrayDatesSelected', {detail: paramPeriod}));
    await page.waitForChanges();
    
    /**
     * @param type: null
     */
    page.root.dispatchEvent(new CustomEvent('dvn-arrayDatesSelected', {detail: ''}));
    await page.waitForChanges();


    expect(handlerDatesSelectedSpy).toHaveBeenCalledTimes(4);
  });
  
  it('should call @Listen dvn-closeDoubleCalendar', async () => {
    const page = await newSpecPage({
      components: [CalendarInputSelection],
      template: ()=> (<calendar-input-selection/>),
    });
    const component = page.rootInstance as CalendarInputSelection;
    const handlerCloseDoubleCalendarSpy = jest.spyOn(component, 'handlerCloseDoubleCalendar');    
    page.root.dispatchEvent(new CustomEvent('dvn-closeDoubleCalendar', {detail: true}));
    await page.waitForChanges();
    expect(handlerCloseDoubleCalendarSpy).toHaveBeenCalled();
  });
  
  it('should call @Listen dvn-previousMonthCalendar and dvn-nextMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [CalendarInputSelection],
      template: ()=> (<calendar-input-selection/>),
    });
    const component = page.rootInstance as CalendarInputSelection;
    const handlerChangeMonthCalendarSpy = jest.spyOn(component, 'handlerChangeMonthCalendar');    
    page.root.dispatchEvent(new CustomEvent('dvn-previousMonthCalendar'));
    await page.waitForChanges();
    expect(handlerChangeMonthCalendarSpy).toHaveBeenCalled();
  });

  it('should call function handleClick when selected div.select-date ', async () => {
    const page = await newSpecPage({
      components: [CalendarInputSelection],
      template: ()=> (<calendar-input-selection/>),
    });
    const component = page.rootInstance as CalendarInputSelection;
    const handleClickSpy = jest.spyOn(component, 'handleClick');
    const containerInput = page.root.shadowRoot.querySelector('.select-date') as HTMLElement;
    containerInput.click();
    await page.waitForChanges();
    expect(handleClickSpy).toHaveBeenCalled();
  });

});
