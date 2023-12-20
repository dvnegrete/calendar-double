import { Component, Element, Host, Listen, State, h } from '@stencil/core';
import { CalendarEntry } from '../../utils/interfaces/calendarEntry';
import { CONSTANTS } from '../shared/constants';

@Component({
  tag: 'double-calendar-container',
  styleUrl: 'double-calendar-container.css',
  shadow: true,
})
export class DoubleCalendarContainer {
  private monthNames = CONSTANTS['es-MX'].monthNames;
  private numberOfPeriods:number = 5;
  @State() assignDate:Date = new Date();
  @State() dateForPeriods:Date = new Date();
  @State() arrayPeriods:CalendarEntry[] = [];
  @Element() el: HTMLElement;
  @State() countDaysSelected = 0;
  @State() showCalendarDouble = true;
  @State() typeSelection: 'oneDay' | 'range' | 'period' = 'oneDay';
  @Listen('dc-applicationDate')
  applicationDate(event: CustomEvent){
    this.countDaysSelected = 1;
  }
  
  @Listen('dc-rangeDate')
  handlerRangeDate(event:CustomEvent){
    const firstSelection = event.detail[0];
    const lastSelection = event.detail[1];
    this.countSelectedDays(firstSelection, lastSelection);
  }

  @Listen('dvnCalendarDoubleSetDate')
  handlerCalendarDobleSetDate(event: CustomEvent){
    const setNewDate:CalendarEntry = event.detail;
    this.assignDate = new Date(setNewDate.year, setNewDate.month, setNewDate.day);
  }

  @Listen('dvnPreviousMonthCalendar')
  @Listen('dvnNextMonthCalendar')
  handlerChangeMonthCalendar(){
    this.countDaysSelected = 0;
  }

  countSelectedDays(firstSelection:CalendarEntry, lastSelection: CalendarEntry){
    const firtsDate = new Date(firstSelection.year, firstSelection.month, firstSelection.day).getTime();
    const lastDate = new Date(lastSelection.year, lastSelection.month, lastSelection.day).getTime();
    const diffInMls = lastDate - firtsDate;
    const diffInDays = diffInMls / (1000 * 60 * 60 * 24);
    this.countDaysSelected = Math.abs(diffInDays) + 1;
  }

  calculateLastDayOfMonth(year: number, month: number){
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
    const daysInMonth = lastDayOfMonth.getDate();  
    return daysInMonth;
  }

  handlerForTypeSelection(type:'oneDay' | 'range' | 'period'){
    this.cleanPeriodsPreview();
    this.countDaysSelected = 0;
    this.typeSelection = type;
  }

  cleanPeriodsPreview(){
    const allPeriods = this.el.shadowRoot.querySelectorAll('.period-list label');
    const periods = Array.from(allPeriods);
    for (const label of periods) {
      if (label.classList.contains('selected-period')) {
        label.classList.remove('selected-period');
      }
      const input = label.children[0] as HTMLInputElement;
      input.checked = false;
    }
  }

  markPeriodInLabel(e: Event, date:CalendarEntry){
    if (this.typeSelection === 'period') {
      this.cleanPeriodsPreview();
      const input = e.target as HTMLInputElement;
      input.checked = true;
      const label = input.parentElement;
      label.classList.add('selected-period');
      this.assignDate = new Date(date.year, date.month, date.day);
      const lastDayMonth:number = this.calculateLastDayOfMonth(date.year, date.month);
      this.countSelectedDays(
        {day: 1, month: date.month, year:date.year},
        {day: lastDayMonth, month: date.month, year:date.year}
      );
    }
  }  
  
  buildPeriods():CalendarEntry[] {
    const periods = [];
    const dateReference:Date = new Date(
      this.dateForPeriods.getFullYear(),
      this.dateForPeriods.getMonth() - 2,
      this.dateForPeriods.getDate()
      );
      for (let i = 0; i < this.numberOfPeriods; i++) {
      const nextMonth = new Date (dateReference);
      nextMonth.setMonth(dateReference.getMonth() + i);
      const dateCalendar:CalendarEntry = {
        day: nextMonth.getDate(),
        month: nextMonth.getMonth(),
        year: nextMonth.getFullYear()
      }
      periods.push(dateCalendar);
    }
    return periods
  }

  changePeriod(value:number) {
    if (this.typeSelection === 'period') {
      this.cleanPeriodsPreview();
      this.dateForPeriods = new Date(this.dateForPeriods.setMonth(this.dateForPeriods.getMonth() + value));
    }
  }

  renderForm(){
    return this.buildPeriods().map( date =>{
      return (
        <label htmlFor={`period${this.monthNames[date.month]}${date.year}`}>
          <input 
            type="radio" 
            name="period"
            id={`period${this.monthNames[date.month]}${date.year}`}
            value={ this.monthNames[date.month] + '-' + date.year }
            onChange={ (event: Event,)=> this.markPeriodInLabel(event, date) }
            ref={ ele => {
              if (ele) {
                ele.disabled = this.typeSelection !== 'period';
              }
            }}
          />
          {this.monthNames[date.month] + ' ' + date.year}
        </label>
      )
    });
  }

  goToToday(){
    this.handlerForTypeSelection('period');
    this.handlerForTypeSelection('oneDay');
    const nodeInput = this.el.shadowRoot.querySelector('#forDay') as HTMLInputElement;
    nodeInput.checked = true;
    this.assignDate = new Date();
    this.dateForPeriods= new Date();
  }

  continue(){}

  render() {
    return (
      <Host>
        <div class='select-date'>

        </div>

        <div class={this.showCalendarDouble ? 'container' : 'container hidden'}>
          <form class='type-selection'>
            <label htmlFor="forDay">
              <input 
                type="radio"
                name='typeSelection'
                id='forDay'
                onInput={ ()=> this.handlerForTypeSelection('oneDay')}
                defaultChecked
              />
              Por día
            </label>
            <label htmlFor="forRange">
              <input 
                type="radio"
                name='typeSelection'
                id='forRange'
                onInput={ ()=> this.handlerForTypeSelection('range')}
              />
              Por rango de días
            </label>
            <label htmlFor="forPeriod">
              <input 
                type="radio"
                name='typeSelection'
                id='forPeriod'
                onInput={ ()=> this.handlerForTypeSelection('period')}
              />
              Por periodo
            </label>
          </form>
        
          <calendar-double 
            class='calendar'
            typeSelection={ this.typeSelection }
            mainDateReceived={ this.assignDate }
          />          

          <form class={this.typeSelection === 'period' ? 'period-list' : 'period-list disabled'}>
            <img 
              src="https://github-personal-dvn.s3.us-east-2.amazonaws.com/img/right-chevron.svg"
              alt="anterior"
              onClick={ ()=>this.changePeriod(-1) }
            />
            { this.renderForm() }
            <img 
              src="https://github-personal-dvn.s3.us-east-2.amazonaws.com/img/right-chevron.svg"
              alt="siguiente"
              onClick={ ()=>this.changePeriod(1) }
            />
          </form>

          <p class='counter-days'>Dias seleccionados: {this.countDaysSelected}</p>

          <button class='go-today' onClick={ ()=> this.goToToday()}>Ir a hoy</button>

          <button class='button-continue' onClick={()=> this.continue()}>
            Continuar
          </button>
        </div>

      </Host>
    );
  }

}
