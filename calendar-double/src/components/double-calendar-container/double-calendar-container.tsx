import { Component, Host, Listen, State, h } from '@stencil/core';

@Component({
  tag: 'double-calendar-container',
  styleUrl: 'double-calendar-container.css',
  shadow: true,
})
export class DoubleCalendarContainer {
  @State() countDaysSelected = 0;
  @State() showCalendarDouble = true;
  @State() typeSelection: 'oneDay' | 'range' = 'range';
  @Listen('dvnApplicationDate')
  applicationDate(event: CustomEvent){
    console.log(event.detail);
    
  }

  handlerForDay(){
    this.typeSelection = 'oneDay';
  }
  handlerForRange(){
    this.typeSelection = 'range';
  }
  handlerForPeriod(){
    this.typeSelection = 'range'
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
                onInput={ ()=> this.handlerForDay()}
              />
              Por día
            </label>
            <label htmlFor="forRange">
              <input 
                type="radio"
                name='typeSelection'
                id='forRange'
                onInput={ ()=> this.handlerForRange()}
              />
              Por rango de días
            </label>
            <label htmlFor="forPeriod">
              <input 
                type="radio"
                name='typeSelection'
                id='forPeriod'
                onInput={ ()=> this.handlerForPeriod()}
              />
              Por periodo
            </label>
          </form>
        
          <calendar-double 
            class='calendar'
            typeSelection={ this.typeSelection }
          />          

          <form class='period-list'>
            <label htmlFor=""></label>
          </form>

         <p>Dias seleccionados: {this.countDaysSelected}</p>

          <button class='button-continue' onClick={()=> this.continue()}>
            Continuar
          </button>
        </div>

      </Host>
    );
  }

}
