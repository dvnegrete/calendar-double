import { Component, Event, EventEmitter, Listen, Prop, State, Watch, h } from '@stencil/core';
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
  private baseNameMonth: string = this.monthNames[0];
  @Prop() dateCalendar: CalendarEntry;
  @Prop() numberCalendar: 'main' | 'secondary' = null;
  @Prop({ reflect: true, mutable: true }) positionRange: PositionRange[] = null; 
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
  
  @Event({eventName: 'dvn-valueCalendarSelected', bubbles:true, composed: true}) valueCalendarSelected: EventEmitter<any>;
  
  @Watch('setCalendar')
  setCalendarChange(newValue: CalendarEntry, oldValue: CalendarEntry){
    if (newValue !== oldValue) {
      this.daysInMonth = this.writeMonth();
    }
  }

  @Listen('dvn-changeCleanPeriod', { target: 'window' })
  handlerChangeCleanPeriod(){
    this.positionRange = null;
  }
  
  @Listen('dvn-cleanCalendarSelection', { target: 'window' })
  handlerCleanCalendarSelection(){
    this.positionRange = null;
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

  writeMonth ():number[] {
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
    this.baseNameMonth = this.monthNames[this.setCalendar.month];
    this.daysInMonth = this.writeMonth();
  }

  dayCalendarIsNow(day:number):boolean {
    const now = new Date();
    const monthNow = now.getMonth();
    const dayNow = now.getDate();
    if (!this.setCalendar || this.setCalendar.month === undefined ) {
      return false
    }
    return this.setCalendar.month === monthNow && day === dayNow;
  }

  /*
  **  Desarrollar lógica para limite deseado usando: verifyLimit(day:number)
  */ 
  private verifyLimit(){
    if ( this.calendarActive || this.typeSelection === 'period' && Array.isArray(this.positionRange)) {
      return true;
    }
    return false;
  }

  daySelectedHandler(day:number){
    const isInsideLimit = this.verifyLimit();
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
      this.valueCalendarSelected.emit(objEmit);
    }
  }

  validateOneDay(){
    return this.typeSelection === 'oneDay' && Array.isArray(this.positionRange);
  }
  
  validateRange(){
    return this.typeSelection === 'range' && Array.isArray(this.positionRange);
  }

  validateTwoPositionsOfRange(day: number){
    return day > Number(this.positionRange[0]) && day < Number(this.positionRange[1])
  }

  validatePeriod(){
    return this.typeSelection === 'period' && Array.isArray(this.positionRange) && this.positionRange.includes(PositionRange.all);
  }

  private nameClassToElement(day: number){
    const classInRange = this.verifyLimit() ? 'in-range' : '';
    const classIsNow = this.dayCalendarIsNow(day) ? 'is-now' : '';
    let classSelected = ''; 
    let classInsideTheRange = '';
    let classAllMonth = '';
    if (this.validateOneDay()) {
      classSelected = this.positionRange.some( dayParam => dayParam === day) ? 'selected' : '';

    } else if (this.validateRange()) {
      classSelected = this.positionRange.some( dayParam => dayParam === day) ? 'selected' : '';

      if ( this.positionRange.includes(PositionRange.firstDay) ){
        classInsideTheRange = day < Number(this.positionRange[1]) ? 'inside-the-range' : '';

      } else if ( this.positionRange.includes(PositionRange.lastDay) ) {
        classInsideTheRange = day > Number(this.positionRange[0]) ? 'inside-the-range' : '';

      } else if (this.positionRange.length === 2){
        this.positionRange.sort( (a,b)=>  Number(a)-Number(b) )
        classInsideTheRange = this.validateTwoPositionsOfRange(day) ? 'inside-the-range' : '';

      }
    } else if (this.validatePeriod()) {
      classAllMonth = (day === 1 || day === this.totalDaysInTheMonth) ? 'selected' : 'inside-the-range';
    }
    
    const combinedClass = [classInRange, classInsideTheRange, classSelected, classAllMonth, classIsNow ].filter(Boolean).join(' ');
    return combinedClass;
  }

  daysInMonthRender(){
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
        
          <header-calendar 
            name-month={ this.baseNameMonth }
            year={ this.year }
            position={ this.numberCalendar === 'main' ? 'right' : 'left' }
            name-inactive={ !this.calendarActive }
          ></header-calendar>

          <div class={ this.calendarActive ? 'day-names' : 'day-names inactive'}>
            { this.dayNames.map( dayname => {
              return (<span>{dayname}</span>)
            }) }
          </div>

            <ol class='days-in-month'>
              { this.daysInMonthRender() }
            </ol>
      </div>
    );
  }

}
