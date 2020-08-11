import {
  ButtonController,
  EffectEnv,
} from './types';

import {
  SetCrossKeyArrow,
  UnsetCrossKeyArrow,
  PopupLabel,
} from './effect';

export class CsCrossKeyController implements ButtonController {
  constructor(
    private keyElement: HTMLElement,
    private arrowElement: HTMLElement,
    private env: EffectEnv,
  ) { }

  pushDown(isHolding: boolean): Promise<any> {
    const pushDown = new SetCrossKeyArrow(this.arrowElement, this.env);
    if (isHolding && this.env.showHoldingStartPopup) {
      const popup = new PopupLabel(this.keyElement, this.env);
      return Promise.all([
        pushDown.exec(),
        popup.exec("押したまま！", 300, "red"),
      ]);
    }
    return pushDown.exec();
  }

  pushUp(fromHolding: boolean): Promise<any> {
    const pushUp = new UnsetCrossKeyArrow(this.arrowElement, this.env);
    if (fromHolding && this.env.showHoldingEndPopup) {
      const popup = new PopupLabel(this.keyElement, this.env);
      return Promise.all([
        pushUp.exec(),
        popup.exec("離す！", 300, "blue"),
      ]);
    }
    return pushUp.exec();
  }
}

