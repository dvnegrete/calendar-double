import { Component, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';
import { CalendarEntry } from './../../utils/interfaces/calendarEntry';
import { PositionRange } from '../../components';

@Component({
  tag: 'calendar-double',
  styleUrl: 'calendar-double.css',
  shadow: true,
})

export class CalendarDouble {
  @Prop() typeSelection: 'oneDay' | 'range' = null;
  @State() calendarActive = true;
  @Listen('dvnPreviousMonthCalendar')
  previousMonthCalendarEvent(){
    // this.shouldCleanDaySelected = false;
    // this.cleanPreviousSelection();
    this.setCalendarMain = {
      day: this.setCalendarSecond.day,
      month: this.setCalendarSecond.month,
      year: this.setCalendarSecond.year
    }
    this.setDate();
  }
  @Listen('dvnNextMonthCalendar')
  nextMonthCalendarEvent(){
    // this.shouldCleanDaySelected = false;
    // this.cleanPreviousSelection();
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
  @State() shouldCleanDaySelected = false;
  //@State() shouldCleanDaySelectedInSecondary = false;

  private firstDayForRange: CalendarEntry = null;
  private lastDayForRange: CalendarEntry = null;

  @State() positionRangeMain: PositionRange | number = null;
  @State() positionRangeSecondary: PositionRange | number = null;

  @Event({eventName:'dvnApplicationDate', bubbles:true, composed: true}) applicationDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnStartDate', bubbles:true, composed: true}) startDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnEndDate', bubbles:true, composed: true}) endDate: EventEmitter<CalendarEntry>;

  @Listen('dvnCalendarSingleDaySelected')
  calendarSingleDaySelected(event: CustomEvent){
    this.shouldCleanDaySelected = false;
    this.daySelectedInMain = this.daySelectedInMain === true ? true : event.detail.name === 'main';
    this.daySelectedInSecondary = this.daySelectedInSecondary === true ? true : event.detail.name === 'secondary';
    if(this.typeSelection === 'oneDay' && this.daySelectedInMain && this.daySelectedInSecondary){
      this.shouldCleanDaySelected = true;
      //this.shouldCleanDaySelected = event.detail.name === 'secondary';
      //this.shouldCleanDaySelectedInSecondary = event.detail.name === 'main';
    }
    
    if (this.typeSelection === 'oneDay') {
      this.applicationDate.emit(event.detail.date);
    } else {
      if (this.firstDayForRange === null) {
        this.firstDayForRange = event.detail.date;
      } else if (this.lastDayForRange === null) {
        this.lastDayForRange = event.detail.date;
      } else {
        // this.shouldCleanDaySelectedInMain = event.detail.name === 'secondary';
        // this.shouldCleanDaySelectedInSecondary = event.detail.name === 'main';
        this.positionRangeMain = null;
        this.positionRangeSecondary = null;
        this.positionRangeMain = event.detail.name === 'main' ? event.detail.date.day : null;
        this.positionRangeSecondary = event.detail.name === 'secondary' ? event.detail.date.day : null;
        this.cleanPreviousSelection()
        this.firstDayForRange = event.detail.date;
        // console.log('this.positionRangeMain', this.positionRangeMain);
        // console.log('this.positionRangeSecondary', this.positionRangeSecondary);
      }
      // console.log('this.firstDayForRange, ', this.firstDayForRange);
      // console.log('this.lastDayForRange', this.lastDayForRange);
    }
  }

  cleanPreviousSelection(){
    this.shouldCleanDaySelected = true;
    //this.shouldCleanDaySelectedInSecondary = true;
    this.firstDayForRange = null;
    this.lastDayForRange = null;
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
      this.shouldCleanDaySelected = true;
      //this.shouldCleanDaySelectedInSecondary = true;
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
          typeSelection={ this.typeSelection }
          numberCalendar='secondary'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarSecond}
          cleanSelection={this.shouldCleanDaySelected}
          positionRange={this.positionRangeSecondary}
        />
        <calendar-single
          typeSelection={ this.typeSelection }
          numberCalendar='main'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarMain}
          cleanSelection={this.shouldCleanDaySelected}
          positionRange={this.positionRangeMain}
        />
      </Host>
    );
  }

}
