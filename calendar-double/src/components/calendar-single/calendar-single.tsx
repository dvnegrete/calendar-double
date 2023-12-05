import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { CalendarEntry } from '../../utils/interfaces/calendarEntry';
import { PositionRange } from '../../utils/enum/positionRange';

@Component({
  tag: 'calendar-single',
  styleUrls: [
    'calendar-single.css',
    './../../utils/assets/fontawesome-free-6.4.2-web/css/all.css',
  ],
  shadow: true,
})
export class CalendarSingle {
  private daynames = [
    'Dom',
    'Lun',
    'Mar',
    'Mie',
    'Jue',
    'Vie',
    'Sab',
  ];
  private monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  private year: string;
  private oneDaySelected: HTMLElement = null;
  private twoDaySelected: HTMLElement = null;

  @Prop() typeSelection: 'oneDay' | 'range' = 'oneDay';
  @State() daysInMonth: number[];
  @Watch('daysInMonth')
  renderdaysInMonth(){
    this.daysInMonthRender();
  }
  @Prop() dateCalendar: CalendarEntry;
  @Prop() numberCalendar: 'main' | 'secondary' = null;
  @Prop() calendarActive: boolean = null;
  @State() valueCalendar: CalendarEntry;
  @Prop({ reflect: true, mutable: true }) setCalendar: CalendarEntry = {month:1, year:2020, day:1};
  @Watch('setCalendar')
  setCalendarChange(newValue: CalendarEntry, oldValue: CalendarEntry){
    if (newValue !== oldValue) {
      this.daysInMonth = this.writeMonth();
    }
  }

  @Prop({reflect: true, mutable: true}) cleanSelection: boolean = false;
  @Watch('cleanSelection')
  cleanSelectionPropHandler(){
    if (this.cleanSelection) {
      console.log(this.numberCalendar, 'cleanSelectionPropHandler');
      
      this.cleanPreviousSelection();
    }
  }
  private baseNameMonth: string = this.monthNames[this.setCalendar.month];
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
    this.year = String(this.setCalendar.year);
    for (let i = 1; i <= this.getTotalDays(this.valueCalendar); i++) {
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

  verifyLimit(day:number){
    //Desarrollar logica para limite deseado
    if (day) {
      return true;
    }
    return false;
  }

  cleanOneDaySelected(){
    if (this.oneDaySelected !== null) {
      this.oneDaySelected.classList.remove('selected');
    }
  }

  cleanPreviousSelection(){
    //console.log('this.oneDaySelected, this.twoDaySelected', this.oneDaySelected, this.twoDaySelected);
    if(Number.isInteger(this.positionRange) && this.twoDaySelected !== null && this.oneDaySelected !== null){
      console.log(">>>>> ", this.numberCalendar, this.oneDaySelected, this.twoDaySelected);
      this.oneDaySelected = this.twoDaySelected;
      console.log(">>>>> reasignado en ",this.oneDaySelected, this.twoDaySelected);
    } else if(this.oneDaySelected !== null) {
      this.cleanOneDaySelected();
      this.oneDaySelected = null;
    }
    if (this.twoDaySelected !== null) {
      this.twoDaySelected.classList.remove('selected');
      this.twoDaySelected = null;
      
    }
  }

  @Event({bubbles:true, composed: true}) dvnCalendarSingleDaySelected: EventEmitter<any>;

  @Prop() positionRange: PositionRange | number = null;
  @Watch('positionRange')
  changePositionRange(newValue: PositionRange|number, oldValue:PositionRange|number){
    if(newValue !== oldValue && Number.isInteger(newValue)){
      this.cleanPreviousSelection();
      // console.log(this.numberCalendar, 'old', oldValue)
      // console.log(this.numberCalendar, 'newValue', newValue)
      // console.log('this.oneDaySelected', this.oneDaySelected)
      // console.log('this.twoDaySelected', this.twoDaySelected)
    }
  }

  sendDateSelected(day: number){
    const selectedDate: CalendarEntry = {
      day,
      month: this.setCalendar.month,
      year: this.setCalendar.year
    }
    const objEmit = {
      name: this.numberCalendar,
      // selected: this.oneDaySelected !== null,
      date: selectedDate
    }
    this.dvnCalendarSingleDaySelected.emit(objEmit);
  }

  daySelectedHandler(event: MouseEvent, day:number){
    const isInsideLimit = this.verifyLimit(day);
    if (isInsideLimit && this.typeSelection === 'oneDay') {
      this.cleanPreviousSelection();
      this.oneDaySelected = event.target as HTMLElement;
      this.oneDaySelected.classList.add('selected');
      this.sendDateSelected(day);
    } else if (isInsideLimit && this.typeSelection === 'range'){      
      if (this.oneDaySelected === null) {
        this.oneDaySelected = event.target as HTMLElement;
        this.oneDaySelected.classList.add('selected');
      } else if(this.twoDaySelected === null){
        this.twoDaySelected = event.target as HTMLElement;
        this.twoDaySelected.classList.add('selected');
      } else {
        this.cleanOneDaySelected();
        this.oneDaySelected = event.target as HTMLElement;
        this.oneDaySelected.classList.add('selected');
      }
      console.log("EMIT!!!!", this.numberCalendar, "oneDaySelected", this.oneDaySelected);
      console.log(this.numberCalendar, "twoDaySelected", this.twoDaySelected);
      
      this.sendDateSelected(day);
    }
  }

  daysInMonthRender(){
    return this.daysInMonth.map( day =>{

      const classIsNow = this.dayCalendarIsNow(day) ? 'is-now' : '';
      const classInRange = (true) ? 'in-range' : ''; 
      const combinedClass = [classIsNow, classInRange].filter(Boolean).join(' ');

      if (day === 0) {
        return <li class='disabled'>{ day }</li>
      } else {
        return (
        <li class={combinedClass} onClick={(event: MouseEvent)=> this.daySelectedHandler(event, day)}>{ day }</li>
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
            { this.daynames.map( dayname => {
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
