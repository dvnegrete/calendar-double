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
    this.setCalendarMain = {
      day: this.setCalendarSecond.day,
      month: this.setCalendarSecond.month,
      year: this.setCalendarSecond.year
    }
    this.setDate();
  }
  @Listen('nextMonthCalendar')
  nextMonthCalendarEvent(){
    this.setCalendarMain = {
      day: this.setCalendarMain.day,
      month: this.setCalendarMain.month + 1,
      year: this.setCalendarMain.year
    }
    if (this.setCalendarMain.month === 12) {
      this.setCalendarMain.month = 0;
      this.setCalendarMain.year = this.setCalendarMain.year + 1;
    }
    this.setDate();
  }

  private daySelectedInMain:boolean = false;
  private daySelectedInSecondary:boolean = false;
  @State() shouldCleanDaySelectedInMain = false;
  @State() shouldCleanDaySelectedInSecondary = false;

  @Listen('daySelectedInCalendarEvent')
  daySelectedInCalendar(event: CustomEvent){
    this.daySelectedInMain = this.daySelectedInMain === true ? true : event.detail.name === 'main';
    this.daySelectedInSecondary = this.daySelectedInSecondary === true ? true : event.detail.name === 'secondary';
    if(this.daySelectedInMain && this.daySelectedInSecondary){
      this.shouldCleanDaySelectedInMain = event.detail.name === 'secondary';
      this.shouldCleanDaySelectedInSecondary = event.detail.name === 'main';
    }
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
    this.setCalendarSecond = {
      day: 1,
      month: this.setCalendarMain.month - 1,
      year: this.setCalendarMain.year
    }
    if (this.setCalendarSecond.month === -1) {
      this.setCalendarSecond.month = 11;
      this.setCalendarSecond.year = --this.setCalendarSecond.year;
    }
    if (this.daySelectedInMain || this.daySelectedInSecondary) {
      this.shouldCleanDaySelectedInMain = true;
      this.shouldCleanDaySelectedInSecondary = true;      
    }
    
  }

  componentWillLoad(){
    this.setCalendarMain = this.getDateNow();
    this.setDate();
  }

  render() {
    return (
      <Host>
        <calendar-single
          typeSelection='oneDay'
          numberCalendar='secondary'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarSecond}
          cleanSelection={this.shouldCleanDaySelectedInSecondary}
          />
        <calendar-single
          typeSelection='oneDay'
          numberCalendar='main'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarMain}
          cleanSelection={this.shouldCleanDaySelectedInMain}
        />
      </Host>
    );
  }

}
