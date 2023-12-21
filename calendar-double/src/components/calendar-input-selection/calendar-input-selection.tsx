import { Component, Host, Listen, State, h } from '@stencil/core';

@Component({
  tag: 'calendar-input-selection',
  styleUrl: 'calendar-input-selection.css',
  shadow: true,
})
export class CalendarInputSelection {
  private readonly defaultPlaceholder = 'Selecciona una fecha';
  @State() placeholder = 'Selecciona una fecha';
  @State() showCalendarDouble = false;

  @Listen('dc-arrayDatesSelected')
  handlerDatesSelected(event: CustomEvent){
    if (Array.isArray(event.detail)) {
      this.legendPlaceHolder(event.detail);
    } else {
      this.placeholder = this.defaultPlaceholder;
    }
  }

  @Listen('dc-closeDoubleCalendar')
  handlerCloseDoubleCalendar(event: CustomEvent){
    this.showCalendarDouble = !event.detail;
  }
  
  @Listen('dvnPreviousMonthCalendar')
  @Listen('dvnNextMonthCalendar')
  handlerChangeMonthCalendar(){
    this.placeholder = this.defaultPlaceholder;
  }  
  
  private legendPlaceHolder(array:Array<any>):void{
    const oneDate:Date = array[0];
    if(array.length === 1){
      this.placeholder = `${oneDate.getDate()}/${oneDate.getMonth() + 1}/${oneDate.getFullYear()}`;
    } else if(array.length === 2){
      const twoDate:Date = array[1];
      const first = `${oneDate.getDate()}/${oneDate.getMonth() + 1}/${oneDate.getFullYear()}`;
      const last = `${twoDate.getDate()}/${twoDate.getMonth() + 1}/${twoDate.getFullYear()}`;
      this.placeholder = `${first} al ${last}`;
    } else if (array.length === 3) {
      this.placeholder = array[2];
    }
  }

  private handleClick(){
    this.showCalendarDouble = !this.showCalendarDouble;
  }

  render() {    
    return (
      <Host>
        <div 
          class='select-date'
          onClick={ ()=> this.handleClick() }
        >
          <p class='day-selectet-text'>{ this.placeholder }</p>
          <div class={ this.showCalendarDouble ? 'box box-selected' : 'box' }>
            <svg xmlns="http://www.w3.org/2000/svg" height="14" width="12" viewBox="0 0 448 512">
              <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/>
            </svg>
          </div>
        </div>

        <double-calendar-container class={ !this.showCalendarDouble ? 'hidden' : '' }/>

      </Host>
      
    );
  }

}
