import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { RotationSVG } from '../../utils/enums/RotationSVG';

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

  headerLeft(){
    return (
      <div 
        class={this.nameInactive ? 'button-next hidden': 'button-next'} 
        onClick={ ()=> {
            if(!this.nameInactive) {
              this.previousMonthCalendar.emit();
            }
          }
        }
      >
        <arrow-left-chevron 
          inactive= { this.nameInactive }
        />
      </div>
    )
  }

  headerRight(){
    return (
      <div 
        class={this.nameInactive ? 'button-next hidden': 'button-next'}
        onClick={ ()=> {
            if(!this.nameInactive) {
              this.nextMonthCalendar.emit();
            }
          }
        }
      >
        <arrow-left-chevron 
          rotation={RotationSVG.Right}
          inactive= { this.nameInactive }
        />
      </div>
    );
  }

  headerEmpty(){
    return (
    <div class='empty'></div>
    );
  }

  render() {
    return (
      <header>
        { this.twoArrow || this.position === 'left' ? this.headerLeft() : this.headerEmpty() }
        <span class={ this.nameInactive ? 'inactive' : '' }>{ this.nameMonth } { this.year }</span> 
        { this.twoArrow || this.position === 'right' ? this.headerRight() : this.headerEmpty() }
      </header>
    );
  }

}
