import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { CalendarEntry } from '../../utils/interfaces/calendarEntry';
import { PositionRange } from '../../utils/enum/positionRange';
import { CONSTANTS } from '../shared/constants';

@Component({
  tag: 'calendar-single',
  styleUrls: [
    'calendar-single.css',
    './../../utils/assets/fontawesome-free-6.4.2-web/css/all.css',
  ],
  shadow: true,
})
export class CalendarSingle {
  private dayNames = CONSTANTS['es-MX'].daynames;
  private monthNames = CONSTANTS['es-MX'].monthNames;
  private totalDaysInTheMonth: number = null;  
  private year: string;  
  @Prop({ reflect: true, mutable: true }) setCalendar: CalendarEntry = {month:11, year:2023, day:19};
  private baseNameMonth: string = this.monthNames[this.setCalendar.month];
  @Prop() dateCalendar: CalendarEntry;
  @Prop() numberCalendar: 'main' | 'secondary' = null;
  @Prop() positionRange: PositionRange[] = null; 
  @Prop() typeSelection: 'oneDay' | 'range' | 'period' = 'oneDay';
  @Watch('typeSelection')
  handlerTypeSelection(newType:string, oldType:string){
    if (newType !== oldType) {
      this.daysInMonthRender();
    }
    
  }
  
  @State() valueCalendar: CalendarEntry;
  @State() daysInMonth: number[];
  @State() sendFromThisCalendar:CalendarEntry = null;
  
  @Prop() calendarActive: boolean = null;  
  @Watch('calendarActive')
  handlerWatchProp(){
    this.daysInMonthRender();
  }
  
  @Event({bubbles:true, composed: true}) dvnCalendarSingleDaySelected: EventEmitter<any>;
  
  @Watch('setCalendar')
  setCalendarChange(newValue: CalendarEntry, oldValue: CalendarEntry){
    if (newValue !== oldValue) {
      this.daysInMonth = this.writeMonth();
    }
  }
  private startDay(date: CalendarEntry){
    const start = new Date(date.year, date.month, date.day);
    return start.getDay();
  }

  private monthOfThirtyOneDays (month: number){
    return (
    month === 0 ||
    month === 2 ||
    month === 4 ||
    month === 6 ||
    month === 7 ||
    month === 9 ||
    month === 11 )
  }

  private monthOfThirtyDays(month: number) {
    return (
      month === 3 ||
      month === 5 ||
      month === 8 ||
      month === 10 )
  }

  private isLeap(year: number){
    return (year % 100 !== 0 && year % 4 === 0) || year % 400 === 0;
  }

  private getTotalDays(date: CalendarEntry): number {
    if (date.month === -1) {
      date.month = 11;
    }
    if (this.monthOfThirtyOneDays(date.month)) {
      return 31;
    } else if (this.monthOfThirtyDays(date.month)) {
      return 30;
    } else {
      return this.isLeap(date.year) ? 29 : 28;
    }
  }

  private writeMonth ():number[] {
    let content = [];
    this.valueCalendar = this.setCalendar;
    for (let i = this.startDay(this.valueCalendar); i > 0; i--) {
      content.push(0);
    }
    this.baseNameMonth = this.monthNames[this.valueCalendar.month];
    this.totalDaysInTheMonth = this.getTotalDays(this.valueCalendar);
    this.year = String(this.setCalendar.year);
    for (let i = 1; i <= this.totalDaysInTheMonth; i++) {
      content.push(i);
    }
    return content;
  }

  componentWillLoad(){
    this.daysInMonth = this.writeMonth();
  }

  private dayCalendarIsNow(day:number):boolean {
    const now = new Date();
    const monthNow = now.getMonth();
    const dayNow = now.getDate();
    if (!this.setCalendar || this.setCalendar.month === undefined ) {
      return false
    }
    return this.setCalendar.month === monthNow && day === dayNow;
  }

  private verifyLimit(day:number){
    //Desarrollar logica para limite deseado
    if (this.calendarActive || this.typeSelection === 'period' && Array.isArray(this.positionRange)) {
      return true;
    }
    return false;
  }

  private daySelectedHandler(day:number){
    const isInsideLimit = this.verifyLimit(day);
    if (isInsideLimit ) {
      const selectedDate: CalendarEntry = {
        day,
        month: this.setCalendar.month,
        year: this.setCalendar.year
      }
      const objEmit = {
        name: this.numberCalendar,
        date: selectedDate
      }
      this.sendFromThisCalendar = selectedDate;
      this.dvnCalendarSingleDaySelected.emit(objEmit);
    }
  }

  private markTheWholeMonth(day: number){
    if (day === 1 || day === this.totalDaysInTheMonth) {
      return 'selected';
    } else {
      return 'inside-the-range'
    }
  }

  private nameClassToElement(day: number){
    const classInRange = this.verifyLimit(day) ? 'in-range' : '';
    let classSelected = ''; 
    let classInsideTheRange = '';
    let classAllMonth = '';
    if (this.typeSelection === 'range' && Array.isArray(this.positionRange)) {
      classSelected = this.positionRange.some( dayParam => dayParam === day) ? 'selected' : '';
      if ( this.positionRange.includes(PositionRange.firstDay) ){
        const limit = Number(this.positionRange[1]);
        classInsideTheRange = day < limit ? 'inside-the-range' : '';
      } else if ( this.positionRange.includes(PositionRange.lastDay )) {
        const limit = Number(this.positionRange[0]);
        classInsideTheRange = day > limit ? 'inside-the-range' : '';
      } else if (this.positionRange.length === 2){
        this.positionRange.sort( (a,b)=>  Number(a)-Number(b) )
        const firstDayRange = Number(this.positionRange[0]);
        const lastDayRange = Number(this.positionRange[1]);
        classInsideTheRange = day > firstDayRange && day < lastDayRange ? 'inside-the-range' : '';
      }
    } else if (this.typeSelection === 'oneDay' && Array.isArray(this.positionRange)) {
      classSelected = this.positionRange.some( dayParam => dayParam === day) ? 'selected' : '';
    } else if (this.typeSelection === 'period' && Array.isArray(this.positionRange) && this.positionRange.includes(PositionRange.all)) {
      classAllMonth = this.markTheWholeMonth(day);
    }
    const classIsNow = this.dayCalendarIsNow(day) ? 'is-now' : '';
    const combinedClass = [classInRange, classInsideTheRange, classSelected, classAllMonth, classIsNow ].filter(Boolean).join(' ');
    return combinedClass;
  }

  private daysInMonthRender(){
    return this.daysInMonth.map( day =>{
      const combinedClass = this.nameClassToElement(day);
      if (day === 0) {
        return <li class='disabled'>{ day }</li>
      } else {
        return (
        <li class={combinedClass} onClick={()=> this.daySelectedHandler(day)}>{ day }</li>
        )
      }
    })
  }

  render() {
    return (
      <div class='container-calendar'>
        <div class='calendar'>
          <header-calendar 
            name-month={ this.baseNameMonth }
            year={ this.year }
            position={ this.numberCalendar === 'main' ? 'right' : 'left' }
            name-inactive={ !this.calendarActive }
          ></header-calendar>

          <div class='day-names'>
            { this.dayNames.map( dayname => {
              return (<span>{dayname}</span>)
            }) }
          </div>

            <ol class='days-in-month'>
              { this.daysInMonthRender() }
            </ol>
        </div>
      </div>
    );
  }

}
