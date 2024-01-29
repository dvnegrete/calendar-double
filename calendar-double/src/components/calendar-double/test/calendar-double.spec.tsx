import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CalendarDouble } from '../calendar-double';
import { CalendarEntry } from '../../../utils/interfaces/calendarEntry';

describe('calendar-double', () => {

  it('renders', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      html: `<calendar-double></calendar-double>`,
    });
    expect(page.root).toEqualHtml(`
      <calendar-double>
        <mock:shadow-root>
          <calendar-single 
            calendaractive="" 
            numbercalendar="secondary" 
            typeselection="oneDay"
          ></calendar-single>
          <calendar-single 
            calendaractive="" 
            numbercalendar="main" 
            typeselection="oneDay"
          ></calendar-single>
        </mock:shadow-root>
      </calendar-double>
    `);
  });

  it('should call Watcher when mainDateReceived changes', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date(2023,5,2) }
          typeSelection='oneDay'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const handlerChangeDateReceivedSpy = jest.spyOn(component, 'handlerChangeDateReceived');
    component.mainDateReceived = new Date();
    await page.waitForChanges();
    expect(handlerChangeDateReceivedSpy).toHaveBeenCalled();
  });
  
  it('should call Watcher when typeSelection changes', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date() }
          typeSelection='oneDay'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const handlerTypeSelectionSpy = jest.spyOn(component, 'handlerTypeSelection');
    component.typeSelection = 'range';
    await page.waitForChanges();
    expect(handlerTypeSelectionSpy).toHaveBeenCalled();
    
    component.typeSelection = 'period';
    await page.waitForChanges();
    expect(handlerTypeSelectionSpy).toHaveBeenCalled();
  });
  
  it('should call @Listen dvn-previousMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date() }
          typeSelection='oneDay'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const previousMonthCalendarEventSpy = jest.spyOn(component, 'previousMonthCalendarEvent');
    page.root.dispatchEvent(new CustomEvent('dvn-previousMonthCalendar'));
    await page.waitForChanges();
    expect(previousMonthCalendarEventSpy).toHaveBeenCalled();
  });

  it('should call @Listen dvn-nextMonthCalendar', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date(2023,11,12) }
          typeSelection='oneDay'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const nextMonthCalendarSpy = jest.spyOn(component, 'nextMonthCalendarEvent');
    page.root.dispatchEvent(new CustomEvent('dvn-nextMonthCalendar'));
    await page.waitForChanges();
    expect(nextMonthCalendarSpy).toHaveBeenCalled();
  });

  it('should call @Listen dvn-valueCalendarSelected when typeSelection is ONEDAY', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date(2023,11,12) }
          typeSelection='oneDay'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const valueCalendarSelectedSpy = jest.spyOn(component, 'calendarSingleDaySelected');

    /**
     * calendar main
     */
    const selectedDate: CalendarEntry = { day:10, month:11, year:2023 };
    const objConfig = {
      name: 'main',
      date: selectedDate
    };
    page.root.dispatchEvent(new CustomEvent('dvn-valueCalendarSelected', { detail: objConfig }));
    await page.waitForChanges();

    /**
     * calendar secondary
     */
    const selectedDateSecondary: CalendarEntry = { day:2, month:11, year:2023 };
    const configSelectedDateSecondary = {
      name: 'secondary',
      date: selectedDateSecondary
    };
    page.root.dispatchEvent(new CustomEvent('dvn-valueCalendarSelected', { detail: configSelectedDateSecondary }));
    await page.waitForChanges();
    
    expect(valueCalendarSelectedSpy).toHaveBeenCalledTimes(2);
  });
  
  it('should call @Listen dvn-valueCalendarSelected when typeSelection is RANGE', async () => {
    const page = await newSpecPage({
      components: [CalendarDouble],
      template: ()=> (
        <calendar-double 
          mainDateReceived={ new Date(2023,11,12) }
          typeSelection='range'
        />
      ),
    });
    const component = page.rootInstance as CalendarDouble;
    const valueCalendarSelectedSpy = jest.spyOn(component, 'calendarSingleDaySelected');
    
    /**
     * firstDayForRange === null
     */
    const firstDayForRange: CalendarEntry = { day:10, month:11, year:2023 };
    const configFirstDayForRange = {
      name: 'main',
      date: firstDayForRange
    };
    page.root.dispatchEvent(new CustomEvent('dvn-valueCalendarSelected', { detail: configFirstDayForRange }));
    await page.waitForChanges();

     /**
     * lastDayForRange  === null
     * calendar = secondary
     */
    const lastDayForRange: CalendarEntry = { day:20, month:10, year:2023 };
    const configLastDayForRange = {
      name: 'secondary',
      date: lastDayForRange
    };
    page.root.dispatchEvent(new CustomEvent('dvn-valueCalendarSelected', { detail: configLastDayForRange }));
    await page.waitForChanges();
     
    /**
     * firstDayForRange and lastDayForRange  !== null
     */
    const newSelectedForRange: CalendarEntry = { day:4, month:11, year:2023 };
    const configNewSelectedForRange = {
      name: 'main',
      date: newSelectedForRange
    };
    page.root.dispatchEvent(new CustomEvent('dvn-valueCalendarSelected', { detail: configNewSelectedForRange }));
    await page.waitForChanges();

    expect(valueCalendarSelectedSpy).toHaveBeenCalledTimes(3);
  });

  // it('should assign event in setForOneDay', async () => {
  //   const page = await newSpecPage({
  //     components: [CalendarDouble],
  //     template: ()=> (
  //       <calendar-double 
  //         mainDateReceived={ new Date(2023,5,2) }
  //         typeSelection='oneDay'
  //       />
  //     ),
  //   });
  //   const component = page.rootInstance as CalendarDouble;
  //   const handlerChangeDateReceivedSpy = jest.spyOn(component, 'handlerChangeDateReceived');
  //   component.mainDateReceived = new Date();
  //   await page.waitForChanges();
  //   expect(handlerChangeDateReceivedSpy).toHaveBeenCalled();
  // });

});
