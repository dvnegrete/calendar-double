import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { DoubleCalendarContainer } from '../double-calendar-container';
import { CalendarEntry } from '../../../utils/interfaces/calendarEntry';
import { CONSTANTS } from '../../shared/constants';

describe('double-calendar-container', () => {

  it('should call @Listen dvn-applicationDate', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const applicationDateSpy = jest.spyOn(component, 'applicationDate');
    const paramDate: CalendarEntry = { day:2, month:11, year:2023 };
    page.root.dispatchEvent(new CustomEvent('dvn-applicationDate', {detail: paramDate}));
    await page.waitForChanges();
    expect(applicationDateSpy).toHaveBeenCalled();
  });
  
  it('should call @Listen dvn-rangeDate', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const handlerRangeDateSpy = jest.spyOn(component, 'handlerRangeDate');
    const paramDate: CalendarEntry[] = [
      { day:2, month:11, year:2023 },
      { day:16, month:11, year:2023 }
    ];
    page.root.dispatchEvent(new CustomEvent('dvn-rangeDate', {detail: paramDate}));
    await page.waitForChanges();
    expect(handlerRangeDateSpy).toHaveBeenCalled();
  });
 
  it('should call @Listen dvn-calendarDoubleSetDate', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const handlerCalendarDobleSetDateSpy = jest.spyOn(component, 'handlerCalendarDobleSetDate');
    const paramDate: CalendarEntry = { day:2, month:11, year:2023 };
    page.root.dispatchEvent(new CustomEvent('dvn-calendarDoubleSetDate', {detail: paramDate}));
    await page.waitForChanges();
    expect(handlerCalendarDobleSetDateSpy).toHaveBeenCalled();
  });
  
  it('should call @Listen dvn-previousMonthCalendar or dvn-nextMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const handlerChangeMonthCalendarSpy = jest.spyOn(component, 'handlerChangeMonthCalendar');
    page.root.dispatchEvent(new CustomEvent('dvn-nextMonthCalendar'));
    await page.waitForChanges();
    expect(handlerChangeMonthCalendarSpy).toHaveBeenCalled();
  });

  it('should call handlerForTypeSelection when selected input of type Radio. Function handlerForTypeSelection', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const handlerForTypeSelectionSpy = jest.spyOn(component, 'handlerForTypeSelection')
    const inputRadioForDay = page.root.shadowRoot.querySelector('#forDay') as HTMLInputElement;
    inputRadioForDay.value = 'oneDay';
    inputRadioForDay.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    
    const inputRadioDorRange = page.root.shadowRoot.querySelector('#forRange') as HTMLInputElement;
    inputRadioDorRange.value = 'range';
    inputRadioDorRange.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    
    const inputRadioForPeriod = page.root.shadowRoot.querySelector('#forPeriod') as HTMLInputElement;
    inputRadioForPeriod.value = 'period';
    inputRadioForPeriod.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    expect(handlerForTypeSelectionSpy).toHaveBeenCalledTimes(3);
  });

  it('should call function changePeriod when selected button other month of form Periods', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const changePeriodSpy = jest.spyOn(component, 'changePeriod');
    component.typeSelection = 'period';
    
    const imgPreviousPeriod = page.root.shadowRoot.querySelectorAll('arrow-left-chevron')[0] as HTMLArrowLeftChevronElement;
    imgPreviousPeriod.click();
    await page.waitForChanges();
    expect(changePeriodSpy).toHaveBeenCalledWith(-1);
    
    const imgNextPeriod = page.root.shadowRoot.querySelectorAll('arrow-left-chevron')[1] as HTMLArrowLeftChevronElement;
    imgNextPeriod.click();
    await page.waitForChanges();
    expect(changePeriodSpy).toHaveBeenCalledWith(1);
  });
  
  it('should call function goToToday when selected button "Ir a Hoy" ', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const goToTodaySpy = jest.spyOn(component, 'goToToday');
    
    const buttonGoToday = page.root.shadowRoot.querySelector('.go-today') as HTMLButtonElement;
    buttonGoToday.click();
    await page.waitForChanges();
    expect(goToTodaySpy).toHaveBeenCalled();
  });
 
  it('should call function markPeriodInLabel when change input of renderForm', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    component.typeSelection = 'period';
    const dateNow = new Date();
    const datePeriods:CalendarEntry = {
      day: dateNow.getDate(),
      month: dateNow.getMonth(),
      year: dateNow.getFullYear(),
    }
    const monthNames = CONSTANTS['es-MX'].monthNames;
    const nameIdElement = `#period${monthNames[datePeriods.month]}${datePeriods.year}`;
    const markPeriodInLabelSpy = jest.spyOn(component, 'markPeriodInLabel');
    await page.setContent(component.renderForm().map(item => item.outerHTML).join(''));
    const inputNamePeriod = page.root.shadowRoot.querySelector(nameIdElement) as HTMLInputElement;
    inputNamePeriod.checked = true;
    inputNamePeriod.dispatchEvent(new Event('change'));
    component.cleanPeriodsPreview();
    await page.waitForChanges();
    expect(markPeriodInLabelSpy).toHaveBeenCalled();
  });

  it('should events capture closeDoubleCalendar', async () => {
    const page = await newSpecPage({
      components: [DoubleCalendarContainer],
      template: ()=> (<double-calendar-container/>),
    });
    const component = page.rootInstance as DoubleCalendarContainer;
    const emitSpy = jest.spyOn(component.closeDoubleCalendar, 'emit');
    const button = page.root.shadowRoot.querySelector('.button-continue') as HTMLElement;
    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });

});
