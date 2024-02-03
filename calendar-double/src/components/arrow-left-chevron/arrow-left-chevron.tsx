import { Component, Host, Prop, h } from '@stencil/core';
import { RotationSVG } from '../../utils/enums/RotationSVG';

@Component({
  tag: 'arrow-left-chevron',
  styleUrl: 'arrow-left-chevron.css',
  shadow: true,
})
export class ArrowLeftChevron {
  @Prop() height = 15;
  @Prop() width = 15;
  @Prop({mutable: true}) inactive = false;

  /**
   * @Prop() rotation
   * enum RotationSVG
   */
  @Prop() rotation:RotationSVG = RotationSVG.Left;

  render() {
    return (
      <Host>
        <svg 
          class={ this.inactive ? 'inactive' : '' }
          height={ this.height + 'px' }
          width={ this.width + 'px' }
          version="1.1"
          id="Layer_1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 511.641 511.641" 
          xmlSpace="preserve"
          style={{ transform: `rotate(${this.rotation}deg)` }}
        >
        <g>
          <g>
            <path 
              d="M148.32,255.76L386.08,18c4.053-4.267,3.947-10.987-0.213-15.04c-4.16-3.947-10.667-3.947-14.827,0L125.707,248.293    c-4.16,4.16-4.16,10.88,0,15.04L371.04,508.667c4.267,4.053,10.987,3.947,15.04-0.213c3.947-4.16,3.947-10.667,0-14.827    L148.32,255.76z"
            />
          </g>
        </g>
        </svg>
      </Host>
    );
  }

}
