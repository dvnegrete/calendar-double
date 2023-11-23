import { Component, Host, Listen, State, h } from '@stencil/core';
import { CalendarEntry } from '../../components';

@Component({
  tag: 'calendar-double',
  styleUrl: 'calendar-double.css',
  shadow: true,
})

export class CalendarDouble {
  @State() calendarActive = false;
  @Listen('previousMonthCalendar')
  previousMonthCalendarEvent(){
    console.log('previousMonthCalendar');
  }
  @Listen('nextMonthCalendar')
  nextMonthCalendarEvent(){
    // this.setCalendarMain = {
    //   day: this.setCalendarMain.day,
    //   month: this.setCalendarMain.month + 1,
    //   year: this.setCalendarMain.year
    // }
    // if (this.setCalendarMain.month === 12) {
    //   this.setCalendarMain.month = 0;
    //   this.setCalendarMain.year = this.setCalendarMain.year + 1;
    // }
    console.log('nextMonthCalendarEvent', this.setCalendarMain);
  }

  @State() setCalendarMain:CalendarEntry = this.getDateNow();
  @State() setCalendarSecond:CalendarEntry = this.getDateNow();
  private getDateNow(): CalendarEntry {
    //const dateNow = new Date('march 17, 2024 03:24:00');
    const dateNow = new Date();
    return {
      day: 1,
      month: dateNow.getMonth(),
      year: dateNow.getFullYear(),
    }
  }

  setDate(){
    this.setCalendarMain = this.getDateNow();
    this.setCalendarSecond = {
      day: 1,
      month: this.setCalendarMain.month - 1,
      year: this.setCalendarMain.year
    }
    console.log("this.setCalendarMain", this.setCalendarMain);
    console.log("this.setCalendarSecond", this.setCalendarSecond);
    
  }

  render() {
    this.setDate();
    return (
      <Host>
        <calendar-single
          numberCalendar='secondary'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarSecond}
          />
        <calendar-single
          numberCalendar='main'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarMain}
        />
      </Host>
    );
  }

}
