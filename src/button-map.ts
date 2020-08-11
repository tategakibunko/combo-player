// import { ButtonName } from '../../combo-script';
import { ButtonName } from 'ts-combo-script';

const actionButtons = [
  'action-up',
  'actionup',
  'triangle',
  'y',
  'action-right',
  'actionright',
  'circle',
  'b',
  'action-down',
  'actiondown',
  'cross',
  'a',
  'action-left',
  'actionleft',
  'square',
  'x',
];

export class ButtonMap {
  static isActionButton(target: ButtonName): boolean {
    return actionButtons.indexOf(target) >= 0;
  }
  static isArrowButton(target: ButtonName): boolean {
    return target === 'up' || target === 'down' || target === 'left' || target === 'right';
  }
  static normalizeButtonName(target: ButtonName): ButtonName {
    switch (target) {
      case 'action-up':
      case 'actionup':
      case 'triangle':
      case 'y':
        return 'action-up';

      case 'action-right':
      case 'actionright':
      case 'circle':
      case 'b':
        return 'action-right';

      case 'action-down':
      case 'actiondown':
      case 'cross':
      case 'a':
        return 'action-down';

      case 'action-left':
      case 'actionleft':
      case 'square':
      case 'x':
        return 'action-left';
    }
    return target;
  }
}