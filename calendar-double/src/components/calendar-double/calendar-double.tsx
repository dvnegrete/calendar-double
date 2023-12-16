import { Component, Event, EventEmitter, Host, Listen, Prop, State, Watch, h } from '@stencil/core';
import { CalendarEntry } from './../../utils/interfaces/calendarEntry';
import { PositionRange } from '../../utils/enum/positionRange';

@Component({
  tag: 'calendar-double',
  styleUrl: 'calendar-double.css',
  shadow: true,
})

export class CalendarDouble {
  @State() typeSelectionState: 'oneDay' | 'range' = 'range';
  @Prop() typeSelection: 'oneDay' | 'range' =  'range';
  @Watch('typeSelection')
  handlerTypeSelection(newType:string, oldType:string){
    if (newType !== oldType) {
      this.typeSelectionState = this.typeSelection;
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
  @State() shouldCleanDaySelected = false;


  @State() rangeMain: number[] = [];
  @State() positionRangeMain: PositionRange[] = null;
  @State() positionRangeSecondary: PositionRange[] = null;

  @Event({eventName:'dvnApplicationDate', bubbles:true, composed: true}) applicationDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnStartDate', bubbles:true, composed: true}) startDate: EventEmitter<CalendarEntry>;
  @Event({eventName:'dvnEndDate', bubbles:true, composed: true}) endDate: EventEmitter<CalendarEntry>;

  @Listen('dvnCalendarSingleDaySelected')
  calendarSingleDaySelected(event: CustomEvent) {
    this.shouldCleanDaySelected = false;
    this.assignValuePositionOneDay(event);
    this.whatCalendarComeFrom(event.detail.date);
    console.log('positionRangeMain', this.positionRangeMain, 'daySelectedInMain', this.daySelectedInMain, 'datesInMain', this.datesInMain);
    console.log('positionRangeSecondary', this.positionRangeSecondary, "daySelectedInSecondary",this.daySelectedInSecondary, 'datesInSecondary', this.datesInSecondary);
    if(this.typeSelection === 'oneDay' && this.daySelectedInMain && this.daySelectedInSecondary){
      this.shouldCleanDaySelected = true;
      this.datesInMain.length > this.datesInSecondary.length ? this.cleanDatesInMain() : this.cleanDatesInSecondary();
      
      this.assignValuePositionOneDay(event);
      //primer valor enviando de secondary.
      //segundo valor enviando de main
      //tengo que mandar positionRangeSecondary = 'empty'
      //el array que tenga mas elementos a este momento es el que se enviara, y solo el primer elemento, es quien se convertira en empty para su calendario.
      //dejar en 
    }
    if (this.typeSelection === 'oneDay') {
      this.applicationDate.emit(event.detail.date);
    } else {
      if (this.firstDayForRange === null) {
        this.assignValuePositionRange(event);
        this.firstDayForRange = event.detail.date;
      } else if (this.lastDayForRange === null) {
        this.lastDayForRange = event.detail.date;
        this.assignValuePositionRange(event);
      } else {        
        this.cleanPreviousSelection();
        this.firstDayForRange = event.detail.date;
        this.assignValuePositionRange(event);
      }
    }
  }

  assignValuePositionOneDay(event: CustomEvent){
    this.daySelectedInMain = this.daySelectedInMain === true ? true : event.detail.name === 'main';
    this.daySelectedInSecondary = this.daySelectedInSecondary === true ? true : event.detail.name === 'secondary';
    // this.positionRangeMain = null;
    // this.positionRangeSecondary = null;
  }

  whatCalendarComeFrom(date:CalendarEntry){
    if (this.daySelectedInMain) {
      this.datesInMain.push(date);
    }
    if (this.daySelectedInSecondary) {
      this.datesInSecondary.push(date);
    }    
  }

  cleanDatesInMain(){
    this.positionRangeMain = [PositionRange.empty];
    this.positionRangeSecondary = null;
    while (this.datesInMain.length > 0) {
      this.datesInMain.pop();
    }
  }
  
  cleanDatesInSecondary(){
    this.positionRangeSecondary = [PositionRange.empty];
    this.positionRangeMain = null;
    while (this.datesInSecondary.length > 0) {
      this.datesInSecondary.pop();
    }
  }

  assignValuePositionRange(event:CustomEvent){
    if (event.detail.name === 'main') {
      this.positionRangeMain = 
        this.firstDayForRange === null 
        ? [event.detail.date.day] 
        :  event.detail.date.month === this.firstDayForRange.month 
          ? [ this.firstDayForRange.day, event.detail.date.day ] 
          : //firstDayForRange no es nulo y el evento entrante proviene del otro calendario. 
          // 1) en el calendario 'main' siempre tendre el limite maximo. 
          // 2) 'this.positionRangeMain' = [firstDay, limite]
          // 3) 'this.positionRangeSecondary' = [limite(viene de), lastDay];
          this.setPositionRangeTwoValues(event);
    } else {
      this.positionRangeSecondary = 
        this.firstDayForRange === null 
        ? [event.detail.date.day]
        : event.detail.date.month === this.firstDayForRange.month 
          ? [this.firstDayForRange.day, event.detail.date.day ] 
          : this.setPositionRangeTwoValues(event);;
    }
  }

  setPositionRangeTwoValues(event:CustomEvent){
    this.sortRangeSelection();
    if (event.detail.name === 'main') {
      this.positionRangeSecondary = [this.firstDayForRange.day, PositionRange.lastDay];
      return [PositionRange.firstDay, this.lastDayForRange.day]
    } else {
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
    this.shouldCleanDaySelected = true;
    this.firstDayForRange = null;
    this.lastDayForRange = null;
    this.positionRangeMain = null;
    this.positionRangeSecondary = null;

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
          typeSelection={ this.typeSelectionState }
          numberCalendar='secondary'
          calendarActive= {this.calendarActive}
          setCalendar={this.setCalendarSecond}
          cleanSelection={this.shouldCleanDaySelected}
          positionRange={this.positionRangeSecondary}
        />
        <calendar-single
          typeSelection={ this.typeSelectionState }
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
