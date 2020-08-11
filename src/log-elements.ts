// import { ButtonName } from '../../combo-script';
import { ButtonName } from 'ts-combo-script';
import { LogElements } from './types';

const actionButtonTmpl = `
<div class="ui circular mini icon emboss button action-up">△</div>
<div class="ui circular mini icon emboss button action-right"><i class="circle outline icon"></i></div>
<div class="ui circular mini icon emboss button action-down">Ｘ</div>
<div class="ui circular mini icon emboss button action-left"><i class="square outline icon"></i></div>
`;

export class CsLogElements implements LogElements {
  constructor(
    public logContainer = document.getElementById("log-container") as HTMLElement,
    private actionButtonTemplate = actionButtonTmpl,
  ) { }

  createStep(): HTMLElement {
    const div = document.createElement("div");
    div.className = "step";
    return div;
  }
  createStepContent(): HTMLElement {
    const div = document.createElement("div");
    div.className = "content";
    return div;
  }
  createArrowIcon(target: ButtonName): HTMLElement {
    const i = document.createElement("i");
    i.className = `arrow alternate big circle outline ${target} icon`;
    return i;
  }
  createRotatedArrowIcon(angle: number): HTMLElement {
    const i = this.createArrowIcon('right');
    i.style.transform = `rotate(${angle}deg)`;
    return i;
  }
  createActionButtons(): HTMLElement {
    const div = document.createElement("div");
    div.className = "action-buttons";
    div.innerHTML = this.actionButtonTemplate;
    return div;
  }
  createActionUpButton(target: ButtonName, color = "black"): HTMLElement {
    const div = document.createElement("div");
    div.className = `ui circular icon ${color} mini button`;
    div.innerHTML = target === "y" ? "Ｙ" : "△";
    return div;
  }
  createActionRightButton(target: ButtonName, color = "black"): HTMLElement {
    const div = document.createElement("div");
    div.className = `ui circular icon ${color} mini button`;
    div.innerHTML = target === "b" ? "Ｂ" : "◯";
    return div;
  }
  createActionDownButton(target: ButtonName, color = "black"): HTMLElement {
    const div = document.createElement("div");
    div.className = `ui circular icon ${color} mini button`;
    div.innerHTML = target === "a" ? "Ａ" : "Ｘ";
    return div;
  }
  createActionLeftButton(target: ButtonName, color = "black"): HTMLElement {
    const div = document.createElement("div");
    div.className = `ui circular icon ${color} mini button`;
    div.innerHTML = target === "x" ? "Ｘ" : "<i class='square outline icon'></i>";
    return div;
  }
  createOptionButton(label: string): HTMLElement {
    const div = document.createElement("div");
    div.className = "ui black icon mini button";
    div.innerHTML = label.toUpperCase();
    return div;
  }
  createStickButton(label: string, color: string): HTMLElement {
    const div = document.createElement("div");
    div.className = `ui circular icon ${color} mini button`;
    div.innerHTML = label.toUpperCase();
    return div;
  }
  createLabelButton(text: string, color = "blue"): HTMLElement {
    const button = document.createElement("span");
    button.className = `ui ${color} label`;
    button.innerHTML = text;
    return button;
  }
  createText(text: string, color: string): HTMLElement {
    const msg = document.createElement("span");
    // const color = this.selectActionGroupColor(group);
    msg.className = `ui basic ${color} small label`;
    msg.innerHTML = text;
    return msg;
  }
  createButton(target: ButtonName): HTMLElement {
    switch (target) {
      case 'up':
      case 'right':
      case 'down':
      case 'left':
        return this.createArrowIcon(target);
      case 'up-right': case 'right-up':
        return this.createRotatedArrowIcon(-45);
      case 'down-right': case 'right-down':
        return this.createRotatedArrowIcon(45);
      case 'down-left': case 'left-down':
        return this.createRotatedArrowIcon(90 + 45);
      case 'up-left': case 'left-up':
        return this.createRotatedArrowIcon(-90 - 45);
      case 'action-up':
      case 'actionup':
      case 'triangle':
      case 'y':
        return this.createActionUpButton(target);
      case 'action-right':
      case 'actionright':
      case 'circle':
      case 'b':
        return this.createActionRightButton(target);
      case 'action-down':
      case 'actiondown':
      case 'cross':
      case 'a':
        return this.createActionDownButton(target);
      case 'action-left':
      case 'actionleft':
      case 'square':
      case 'x':
        return this.createActionLeftButton(target);
      case 'l1':
      case 'l2':
      case 'r1':
      case 'r2':
        return this.createOptionButton(target);
      case 'l3':
        return this.createStickButton(target, "orange");
      case 'r3':
        return this.createStickButton(target, "purple");
    }
    console.error(`Unsupported button name:${target}`);
    return this.createLabelButton(`${target}`, "black");
  }
}
