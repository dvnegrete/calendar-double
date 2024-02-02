import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CalendarSingle } from '../calendar-single';
import { CalendarEntry } from '../../../utils/interfaces/calendarEntry';

describe('calendar-single', () => {
  
   it('test when type selection is "range" ', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='range'
          positionRange={ ['all'] }
          numberCalendar='main'
          calendarActive= { true }
        />
      ),
    });
    expect(page.rootInstance.positionRange).not.toBeNull();
    expect(page.rootInstance.numberCalendar).not.toBeNull();
  });

  it('should call Watcher when typeSelection and calendarActive changes', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          positionRange={ ['all'] }
          calendarActive= { true }
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    const daysInMonthRenderSpy = jest.spyOn(component, 'daysInMonthRender');
    component.typeSelection = 'range';
    await page.waitForChanges();
    expect(daysInMonthRenderSpy).toHaveBeenCalled();
    
    component.calendarActive = false;
    await page.waitForChanges();
    expect(daysInMonthRenderSpy).toHaveBeenCalled();
  });
 
  it('should call Watcher when setCalendar changes', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          setCalendar={ {month: 10, year: 2023, day: 14} }
          calendarActive= { true }
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    const writeMonthSpy = jest.spyOn(component, 'writeMonth');
    component.setCalendar = {month: 9, year: 2023, day: 10};
    await page.waitForChanges();
    expect(writeMonthSpy).toHaveBeenCalled();
  });
 
  it('should call @Listen handlerChangeCleanPeriod ', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          setCalendar={ {month: 10, year: 2023, day: 14} }
          calendarActive= { true }
          positionRange={ ['all'] }
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    const handlerChangeCleanPeriodSpy = jest.spyOn(component, 'handlerChangeCleanPeriod');
    window.dispatchEvent(new CustomEvent('dvn-changeCleanPeriod'));
    await page.waitForChanges();
    expect(handlerChangeCleanPeriodSpy).toHaveBeenCalled();
    expect(page.rootInstance.positionRange).toBeNull();
  });
  
  it('should call @Listen handlerCleanCalendarSelection ', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          setCalendar={ {month: 10, year: 2023, day: 14} }
          calendarActive= { true }
          positionRange={ ['all'] }
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    const handlerChangeCleanPeriodSpy = jest.spyOn(component, 'handlerCleanCalendarSelection');
    window.dispatchEvent(new CustomEvent('dvn-cleanCalendarSelection'));
    await page.waitForChanges();
    expect(handlerChangeCleanPeriodSpy).toHaveBeenCalled();
    expect(page.rootInstance.positionRange).toBeNull();
  });
  
  it('test when month have 30 days', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='period'
          setCalendar={ {month: 10, year: 2023, day: 14}}
        />
      ),
    });
    expect(page.rootInstance.totalDaysInTheMonth).toBe(30);
  });
  
  it('test when month is leap February', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='period'
          setCalendar={ {month: 1, year: 2024, day: 14}}
        />
      ),
    });
    expect(page.rootInstance.totalDaysInTheMonth).toBe(29);
  });
  
  it('test when month is February with 28 days', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='period'
          setCalendar={ {month: 1, year: 2023, day: 14}}
        />
      ),
    });
    expect(page.rootInstance.totalDaysInTheMonth).toBe(28);
  });

  it('should call function daySelectedHandler', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='period'
          setCalendar={ {month: -1, year: 2023, day: 14}}
          calendarActive= {true}
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    const daySelectedHandlerSpy = jest.spyOn(component,'daySelectedHandler');
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("13")') as HTMLElement;
    dayElementLi.click();
    expect(daySelectedHandlerSpy).toHaveBeenCalled();
  });

  it('day "1" should contains class "inside-the-range" when receives PositionRange = [firstDay, 15]', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='range'
          positionRange={ ['firstDay', 15] }
          setCalendar={ {month: 10, year: 2023, day: 18}}
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("1")') as HTMLElement;
    expect(dayElementLi.classList.contains('inside-the-range')).toBeTruthy();
  });

  it('day "21" should contains class "inside-the-range" when receives PositionRange = [20, lastDay]', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='range'
          positionRange={ [20, 'lastDay'] }
          setCalendar={ {month: 10, year: 2023, day: 18}}
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("21")') as HTMLElement;
    expect(dayElementLi.classList.contains('inside-the-range')).toBeTruthy();
  });
  
  it('day "23" should contains class "inside-the-range" when receives PositionRange = [20, 25]', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='range'
          positionRange={ [20, 25] }
          setCalendar={ {month: 10, year: 2023, day: 18}}
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("23")') as HTMLElement;
    expect(dayElementLi.classList.contains('inside-the-range')).toBeTruthy();
  });

  it('day "15" should contains class "inside-the-range" when receives Position.all and typeSelection="period" ', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='period'
          positionRange={ ['all'] }
          setCalendar={ {month: 10, year: 2023, day: 18}}
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("15")') as HTMLElement;
    expect(dayElementLi.classList.contains('inside-the-range')).toBeTruthy();
  });
  
  it('day "14" should contains class "selected" when receives typeSelection="oneDay" ', async () => {
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='oneDay'
          positionRange={ [14] }
          setCalendar={ {month: 10, year: 2023, day: 18}}
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector('li:contains("14")') as HTMLElement;
    expect(dayElementLi.classList.contains('selected')).toBeTruthy();
  });
 
  it('test when day is now. should class contain "is-now" ', async () => {
    const today = new Date();
    const paramDate:CalendarEntry = {
      day: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear()
    }
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          setCalendar={ paramDate }
          calendarActive= { true }
        />
      ),
    });
    const dayElementLi = page.root.shadowRoot.querySelector(`li:contains("${paramDate.day}")`) as HTMLElement;
    expect(dayElementLi.classList.contains('is-now')).toBeTruthy();
  });
  
  it('test when setCalendar.month is undefined ', async () => {
    const paramDate:CalendarEntry = {
      day: 5,
      month: undefined,
      year: undefined
    }
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          setCalendar={ paramDate }
          calendarActive= { true }
        />
      ),
    });
    const component = page.rootInstance as CalendarSingle;
    jest.spyOn(component,'dayCalendarIsNow');
  });

  it('should contains class "in-range" when receives limit of 3 months backward and forward', async () => {
    const today = new Date();
    const quantity = 3;
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='oneDay'          
          setCalendar={ {month: today.getMonth(), year: today.getFullYear(), day: today.getDate() }}
          limitType='month'
          limitDirection='forwardAndBackward'
          limitTotal={ quantity }
          calendarActive= { true }
        />
      ),
    });
    const limitBackward = new Date(today.getFullYear(), today.getMonth() - quantity, today.getDate())
    const evaluateLimitBackward = { day: limitBackward.getDate(), month: limitBackward.getMonth(), year: limitBackward.getFullYear() };
    const dateBackward = { day: page.rootInstance.dateBackward.getDate(), month: page.rootInstance.dateBackward.getMonth(), year: page.rootInstance.dateBackward.getFullYear() }    
    expect(dateBackward).toEqual(evaluateLimitBackward);

    const limitForward = new Date(today.getFullYear(), today.getMonth() + quantity, today.getDate())
    const evaluateLimitForward = { day: limitForward.getDate(), month: limitForward.getMonth(), year: limitForward.getFullYear() };
    const dateForward = { day: page.rootInstance.dateForward.getDate(), month: page.rootInstance.dateForward.getMonth(), year: page.rootInstance.dateForward.getFullYear() };
    expect(dateForward).toEqual(evaluateLimitForward);
  });
  
  it('should contains class "in-range" when receives limit of 12 month forward. should dateBackward is null', async () => {
    const today = new Date();
    const quantity = 12;
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='oneDay'          
          setCalendar={ {month: today.getMonth(), year: today.getFullYear(), day: today.getDate() }}
          limitType='month'
          limitDirection='forward'
          limitTotal={ quantity }
          calendarActive= { true }
        />
      ),
    });    
    const limitForward = new Date(today.getFullYear(), today.getMonth() + quantity, today.getDate())
    const evaluateLimitForward = { day: limitForward.getDate(), month: limitForward.getMonth(), year: limitForward.getFullYear() };
    const dateForward = { day: page.rootInstance.dateForward.getDate(), month: page.rootInstance.dateForward.getMonth(), year: page.rootInstance.dateForward.getFullYear() };
    expect(dateForward).toEqual(evaluateLimitForward);

    expect(page.rootInstance.dateBackward).toBeNull();
  });
 
  it('should contains class "in-range" when receives limit of 6 years backward. should dateForward is null', async () => {
    const today = new Date();
    const quantity = 6;
    const page = await newSpecPage({
      components: [CalendarSingle],
      template: ()=> (
        <calendar-single 
          typeSelection='oneDay'          
          setCalendar={ {month: today.getMonth(), year: today.getFullYear(), day: today.getDate() }}
          limitType='year'
          limitDirection='backward'
          limitTotal={ quantity }
          calendarActive= { true }
        />
      ),
    });
    const limitBackward = new Date(today.getFullYear() - quantity, today.getMonth(), today.getDate())
    const evaluateLimitBackward = { day: limitBackward.getDate(), month: limitBackward.getMonth(), year: limitBackward.getFullYear() };
    const dateBackward = { day: page.rootInstance.dateBackward.getDate(), month: page.rootInstance.dateBackward.getMonth(), year: page.rootInstance.dateBackward.getFullYear() }    
    expect(dateBackward).toEqual(evaluateLimitBackward);

    expect(page.rootInstance.dateForward).toBeNull();
  });

});
