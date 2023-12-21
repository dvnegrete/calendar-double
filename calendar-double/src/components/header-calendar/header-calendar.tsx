import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

@Component({
  tag: 'header-calendar',
  styleUrl: 'header-calendar.css',
  shadow: true,
})
export class HeaderCalendar {
  @Prop() nameMonth: string;
  @Prop() year: string;
  @Prop() nameInactive = false;
  @Prop() position: 'left' | 'right' = null;
  @Prop() twoArrow = false;
  @Event({ eventName:'dvn-nextMonthCalendar', composed:true, cancelable: true, bubbles: true }) nextMonthCalendar: EventEmitter;
  @Event({ eventName:'dvn-previousMonthCalendar', composed:true, cancelable: true, bubbles: true }) previousMonthCalendar: EventEmitter;

  render() {
    return (
      <header>
        {this.twoArrow || this.position === 'left' ? 
        <div 
          class={this.nameInactive ? 'button-next hidden': 'button-next'} 
          onClick={ ()=> this.previousMonthCalendar.emit() }>
            <img 
              src="https://github-personal-dvn.s3.us-east-2.amazonaws.com/img/left-chevron.svg" 
              alt="atras"
            />
        </div>
        : <div class='empty'></div>
        }
        <span class={ this.nameInactive ? 'inactive' : '' }>{ this.nameMonth } { this.year }</span> 
        { this.twoArrow || this.position === 'right' ? 
          <div 
            class={this.nameInactive ? 'button-next hidden': 'button-next'} 
            onClick={ ()=> this.nextMonthCalendar.emit() }>
              <img 
              src="https://github-personal-dvn.s3.us-east-2.amazonaws.com/img/right-chevron.svg" 
              alt="siguiente" />
          </div>
        : <div class='empty'></div>
        }
      </header>
    );
  }

}
