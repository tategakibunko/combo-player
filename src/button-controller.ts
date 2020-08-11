import { EffectEnv, ButtonController } from './types';
import { PushDownButton, PushUpButton, PopupLabel } from './effect';

export class CsButtonController implements ButtonController {
  constructor(
    private element: HTMLElement,
    private env: EffectEnv,
    private isEmboss: boolean,
  ) { }

  async pushDown(isHolding: boolean): Promise<any> {
    const pushDown = new PushDownButton(this.element, this.env);
    if (isHolding && this.env.showHoldingStartPopup) {
      const popup = new PopupLabel(this.element, this.env);
      return Promise.all([
        pushDown.exec(this.isEmboss),
        popup.exec("押したまま！", 500, "blue"),
      ]);
    }
    return pushDown.exec(this.isEmboss);
  }

  async pushUp(fromHolding: boolean): Promise<any> {
    const pushUp = new PushUpButton(this.element, this.env);
    if (fromHolding && this.env.showHoldingEndPopup) {
      const popup = new PopupLabel(this.element, this.env);
      return Promise.all([
        pushUp.exec(this.isEmboss),
        popup.exec("離す！", 500, "blue"),
      ]);
    }
    return pushUp.exec(this.isEmboss);
  }
}

export class CsStickButtonController implements ButtonController {
  constructor(
    private element: HTMLElement,
    private svgCircleElement: SVGCircleElement,
    private env: EffectEnv,
    private isEmboss: boolean,
    private color: string,
    private pushedColor: string,
  ) { }

  async pushDown(isHolding: boolean): Promise<any> {
    this.svgCircleElement.style.fill = this.pushedColor;

    const pushDown = new PushDownButton(this.element, this.env);
    this.element.querySelector("circle")!.style.fill = this.pushedColor;
    if (isHolding && this.env.showHoldingStartPopup) {
      const popup = new PopupLabel(this.element, this.env);
      return Promise.all([
        pushDown.exec(this.isEmboss),
        popup.exec("押したまま！", 500, "red"),
      ]);
    }
    return pushDown.exec(false);
  }

  async pushUp(fromHolding: boolean): Promise<any> {
    this.svgCircleElement.style.fill = this.color;

    const pushUp = new PushUpButton(this.element, this.env);
    if (fromHolding && this.env.showHoldingEndPopup) {
      const popup = new PopupLabel(this.element, this.env);
      return Promise.all([
        pushUp.exec(this.isEmboss),
        popup.exec("離す！", 500, "blue"),
      ]);
    }
    return pushUp.exec(this.isEmboss);
  }
}

