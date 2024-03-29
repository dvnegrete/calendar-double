import { Component, Element, Event, EventEmitter, Host, Listen, State, h } from '@stencil/core';
import { CalendarEntry } from '../../utils/interfaces/calendarEntry';
import { CONSTANTS } from '../shared/constants';
import { RotationSVG } from '../../utils/enums/RotationSVG';

@Component({
  tag: 'double-calendar-container',
  styleUrl: 'double-calendar-container.css',
  shadow: true,
})
export class DoubleCalendarContainer {
  @Event({eventName:'dvn-arrayDatesSelected', bubbles:true, composed: true}) showDate: EventEmitter<Array<Date | string>>;
  @Event({eventName:'dvn-closeDoubleCalendar', bubbles:true, composed: true }) closeDoubleCalendar: EventEmitter<boolean>;
  @Event({eventName:'dvn-changeCleanPeriod', bubbles:true, composed: true }) changeCleanPeriod: EventEmitter<any>;
  @Event({eventName:'dvn-cleanCalendarSelection', bubbles:true, composed: true }) cleanCalendarSelection: EventEmitter<any>;

  @Element() el: HTMLElement;

  private numberOfPeriods:number = 5;
  private monthNames = CONSTANTS['es-MX'].monthNames;
  @State() assignDate:Date = new Date();
  @State() dateForPeriods:Date = new Date();
  @State() arrayPeriods:CalendarEntry[] = [];
  @State() countDaysSelected:number = 0;
  @State() buttonContinue = false;
  @State() typeSelection: 'oneDay' | 'range' | 'period' = 'oneDay';

  /**
   * 
   * @param event receives <CalendarEntry>
   * 
   */
  @Listen('dvn-applicationDate')
  applicationDate(event: CustomEvent){
    this.countDaysSelected = 1;
    const date = this.convertCalendarEntryOnDate(event.detail);
    this.showDate.emit([date]);
    this.buttonContinue = true;
  }
  
   /**
   * 
   * @param event receives <CalendarEntry[]>
   * 
   */
  @Listen('dvn-rangeDate')
  handlerRangeDate(event:CustomEvent){
    const firstSelection = this.convertCalendarEntryOnDate(event.detail[0]);
    const lastSelection = this.convertCalendarEntryOnDate(event.detail[1]);
    this.countSelectedDays(firstSelection, lastSelection);
    this.showDate.emit([ firstSelection, lastSelection ]);
    this.buttonContinue = true;
  }

  /**
   * 
   * @param event receives <CalendarEntry>
   * 
   */
  @Listen('dvn-calendarDoubleSetDate')
  handlerCalendarDobleSetDate(event: CustomEvent){
    const setNewDate:CalendarEntry = event.detail;
    this.assignDate = new Date(setNewDate.year, setNewDate.month, setNewDate.day);
  }

  @Listen('dvn-previousMonthCalendar')
  @Listen('dvn-nextMonthCalendar')
  handlerChangeMonthCalendar(){
    this.countDaysSelected = 0;
    this.buttonContinue = false;
  }

  private convertCalendarEntryOnDate(date: CalendarEntry):Date {
    return new Date(date.year, date.month, date.day)
  }

  private countSelectedDays(firstSelection:Date, lastSelection: Date){    
    const diffInMls = lastSelection.getTime() - firstSelection.getTime();
    const diffInDays = diffInMls / (1000 * 60 * 60 * 24);
    this.countDaysSelected =Math.round(Math.abs(diffInDays) + 1);
  }

  private calculateLastDayOfMonth(year: number, month: number):number {
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
    const daysInMonth = lastDayOfMonth.getDate();  
    return daysInMonth;
  }

  handlerForTypeSelection(type:'oneDay' | 'range' | 'period'){
    this.cleanPeriodsPreview();
    this.countDaysSelected = 0;
    this.typeSelection = type;
    this.showDate.emit();
    this.buttonContinue = false;
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

  markPeriodInLabel(event: Event, date:CalendarEntry){
    if (this.typeSelection === 'period') {
      this.cleanPeriodsPreview();
      const input = event.target as HTMLInputElement;
      input.checked = true;
      const label = input.parentElement;
      label.classList.add('selected-period');
      this.assignDate = new Date(date.year, date.month, date.day);
      const lastDayMonth:number = this.calculateLastDayOfMonth(date.year, date.month);
      const firstDate = this.convertCalendarEntryOnDate({day: 1, month: date.month, year:date.year})
      const lastDay = this.convertCalendarEntryOnDate({day: lastDayMonth, month: date.month, year:date.year})
      this.countSelectedDays(firstDate, lastDay);
      const stringPeriod = `${CONSTANTS['es-MX'].monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
      this.showDate.emit([firstDate, lastDay, stringPeriod]);
      this.buttonContinue = true;
    }
  }
  
  private buildPeriods():CalendarEntry[] {
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
      this.changeCleanPeriod.emit();
      this.dateForPeriods = new Date(this.dateForPeriods.setMonth(this.dateForPeriods.getMonth() + value));
      this.buttonContinue = false;
    }
  }

  goToToday(){
    this.handlerForTypeSelection('oneDay');
    const nodeInput = this.el.shadowRoot.querySelector('#forDay') as HTMLInputElement;
    nodeInput.checked = true;
    this.assignDate = new Date();
    this.dateForPeriods= new Date();
    this.showDate.emit();
    this.cleanCalendarSelection.emit();
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

  render() {
    return (
      <Host>
        <div class='container'>
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
            limitType='month'
            limitDirection='forwardAndBackward'
            limitTotal={ 3 }
          />          

          <div class={this.typeSelection === 'period' ? 'period-list' : 'period-list disabled'}>
              <arrow-left-chevron 
                rotation={ RotationSVG.Up } 
                height={ 17 } 
                width={ 20 }
                inactive= {this.typeSelection !== 'period'}
                onClick={ ()=>this.changePeriod(-1) }
                />
              <form >
                { this.renderForm() }
              </form>
              <arrow-left-chevron 
                rotation={ RotationSVG.Down } 
                height={ 17 } 
                width={ 20 }
                inactive= {this.typeSelection !== 'period'}
                onClick={ ()=>this.changePeriod(1) }
              />
          </div>

          <p class='counter-days'>Dias seleccionados: <span>{ this.countDaysSelected }</span></p>

          <button class='go-today' onClick={ ()=> this.goToToday()}>Ir a hoy</button>

          <button 
            class={ this.buttonContinue ? 'button-continue completed' : 'button-continue' } 
            onClick={()=> this.closeDoubleCalendar.emit(this.buttonContinue)}>
            Continuar
          </button>
        </div>

      </Host>
    );
  }

}
