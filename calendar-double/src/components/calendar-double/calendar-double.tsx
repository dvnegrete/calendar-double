import { Component, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { CalendarEntry } from './../../utils/interfaces/calendarEntry';
import { PositionRange } from '../../utils/enum/positionRange';

@Component({
  tag: 'calendar-double',
  styleUrl: 'calendar-double.css',
  shadow: true,
})

export class CalendarDouble {
  @State() typeSelectionMain: 'oneDay' | 'range' | 'period' = 'oneDay';
  @State() typeSelectionSecondary: 'oneDay' | 'range' | 'period' = 'oneDay';
  @Prop() typeSelection: 'oneDay' | 'range' | 'period' =  'oneDay';
  @Watch('typeSelection')
  handlerTypeSelection(newType:string, oldType:string){
    if (newType !== oldType) {
      this.typeSelectionMain = this.typeSelection;
      this.typeSelectionSecondary = this.typeSelection === 'period' ? 'range': this.typeSelection;
      this.calendarActive =  this.typeSelection !== 'period';
      this.cleanPreviousSelection();
    }

  }
  @State() calendarActive = true;
  @Listen('dvnPreviousMonthCalendar')
  previousMonthCalendarEvent(){
    this.cleanPreviousSelection();
    this.setCalendarMain = {
      day: this.setCalendarSecond.day,
      month: this.setCalendarSecond.month,
      year: this.setCalendarSecond.year
    }
    this.setDate();
  }
  @Listen('dvnNextMonthCalendar')
  nextMonthCalendarEvent(){
    this.cleanPreviousSelection();
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

  private firstDayForRange: CalendarEntry = null;
  private lastDayForRange: CalendarEntry = null;
  private daySelectedInMain:boolean = false;
  private daySelectedInSecondary:boolean = false;
  private datesInMain:CalendarEntry[] = [];
  private datesInSecondary:CalendarEntry[] = [];


  @State() rangeMain: number[] = [];
  @State() positionRangeMain: PositionRange[] = null;
  @State() positionRangeSecondary: PositionRange[] = null;

  @Event({eventName:'dvnApplicationDate', bubbles:true, composed: true}) applicationDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnStartDate', bubbles:true, composed: true}) startDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnEndDate', bubbles:true, composed: true}) endDate: EventEmitter<CalendarEntry>;

  @Listen('dvnCalendarSingleDaySelected')
  calendarSingleDaySelected(event: CustomEvent) {
    this.assignValuePositionOneDay(event);
    if (this.typeSelection === 'oneDay') {
      this.setForOneDay(event);
      this.applicationDate.emit(event.detail.date);
    } else if (this.typeSelection === 'range') {
      this.addDateOnSelectedCalendar(event.detail.date);
      if (this.firstDayForRange === null) {
        this.assignValueFromSelectedRange(event);
        this.firstDayForRange = event.detail.date;
      } else if (this.lastDayForRange === null) {
        this.lastDayForRange = event.detail.date;
        this.assignValueFromSelectedRange(event);
      } else {
        this.cleanPreviousSelection();
        this.firstDayForRange = event.detail.date;
        this.assignValueFromSelectedRange(event);
      }
    }
  }

  assignValuePositionOneDay(event: CustomEvent){
    if (event.detail.name === 'main') {
      this.daySelectedInMain = true;
    }
    if (event.detail.name === 'secondary') {
      this.daySelectedInSecondary = true;
    }
  }

  setForOneDay(event: CustomEvent){
    this.cleanPreviousSelection();
    this.positionRangeMain = event.detail.name === 'main' ? [event.detail.date.day] : null;
    this.positionRangeSecondary = event.detail.name === 'secondary' ? [event.detail.date.day] : null;
  }

  addDateOnSelectedCalendar(date:CalendarEntry){
    if (this.daySelectedInMain) {
      this.datesInMain.push(date);
    }
    if (this.daySelectedInSecondary) {
      this.datesInSecondary.push(date);
    }
  }

  cleanDatesInMain(){
    while (this.datesInMain.length > 0) {
      this.datesInMain.pop();
    }
  }
  
  cleanDatesInSecondary(){
    while (this.datesInSecondary.length > 0) {
      this.datesInSecondary.pop();
    }
  }

  assignValueFromSelectedRange(event:CustomEvent){
    if (event.detail.name === 'main') {
      this.positionRangeMain = 
        this.firstDayForRange === null 
        ? [event.detail.date.day] 
        :  this.setRangeOfDaysInASingleCalendar(event);
    } else if (event.detail.name === 'secondary') {
      this.positionRangeSecondary = 
        this.firstDayForRange === null 
        ? [event.detail.date.day]
        : this.setRangeOfDaysInASingleCalendar(event);
    }
  }

  setRangeOfDaysInASingleCalendar(event: CustomEvent){
    if (event.detail.date.month === this.firstDayForRange.month) {
      return [ this.firstDayForRange.day, event.detail.date.day ]
    } else {
      return this.setRangeDayOnBothCalendars(event);
    }
  }

  setRangeDayOnBothCalendars(event:CustomEvent){
    this.sortRangeSelection();
    if (event.detail.name === 'main') {
      this.positionRangeSecondary = [this.firstDayForRange.day, PositionRange.lastDay];
      return [PositionRange.firstDay, this.lastDayForRange.day]
    } else if (event.detail.name === 'secondary') {
      this.positionRangeMain = [PositionRange.firstDay, this.lastDayForRange.day];
      return [this.firstDayForRange.day, PositionRange.lastDay]
    }
  }

  sortRangeSelection(){
    const sortRange = [this.firstDayForRange, this.lastDayForRange];
    sortRange.sort( (a,b) => {
      if (a.year !== b.year) {
        return a.year -b.year;
      }
      if (a.month !== b.month) {
        return a.month - b.month
      }
      return a.day - b.day;
    })
    this.firstDayForRange = sortRange[0];
    this.lastDayForRange = sortRange[1]
  }

  cleanPreviousSelection(){
    this.firstDayForRange = null;
    this.lastDayForRange = null;
    this.positionRangeMain = null;
    this.positionRangeSecondary = null;
    this.cleanDatesInMain();
    this.cleanDatesInSecondary();

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
  }

  componentWillLoad(){
    this.setCalendarMain = this.getDateNow();
    this.setDate();
  }

  render() {
    return (
      <Host>
        <calendar-single
          typeSelection={ this.typeSelectionSecondary }
          numberCalendar='secondary'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarSecond}
          positionRange={this.positionRangeSecondary}
        />
        <calendar-single
          typeSelection={ this.typeSelectionMain }
          numberCalendar='main'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarMain}
          positionRange={this.positionRangeMain}
        />
      </Host>
    );
  }

}
