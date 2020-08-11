// import { Action, OrActions, ActionTextGroup, ButtonName, StickName, ActionContext, AndActions } from '../../combo-script';
import { Action, OrActions, ActionTextGroup, ButtonName, StickName, ActionContext, AndActions } from 'ts-combo-script';
import { ShakeElement, RotateStickSVG, MoveStickSVG, SetStickSVG } from './effect';
import { EffectEnv, ActionController, LogElements } from './types';
import { ButtonMap } from './button-map';
import { StickElementFactory } from './stick-element-factory';

export class CsLogController implements ActionController {
  constructor(
    private logElements: LogElements,
    private env: EffectEnv,
    private logContainer = logElements.logContainer, // <div id="steps"></div>
    private stepContainer: HTMLElement | undefined = undefined,
    private contentContainer: HTMLElement | undefined = undefined,
    private actionButtonContainer: HTMLElement | undefined = undefined,
  ) { }

  private selectActionGroupColor(group: ActionTextGroup): string {
    switch (group) {
      case "normal": return "black";
      case "info": return "blue";
      case "warn": return "orange";
      case "error": return "red";
    }
  }
  private disposeUIElement() {
    this.stepContainer = undefined;
    this.contentContainer = undefined;
    this.actionButtonContainer = undefined;
  }
  private withStepContent(context: ActionContext, fn: (content: HTMLElement) => void) {
    if (!this.stepContainer) {
      this.stepContainer = this.logElements.createStep();
    }
    if (!this.contentContainer) {
      this.contentContainer = this.logElements.createStepContent();
    }
    fn(this.contentContainer);
    // If member of action set, it will be closed by playActionEnd event.
    if (context.ownerActionSet) {
      return;
    }
    this.stepContainer.appendChild(this.contentContainer);
    this.logContainer.appendChild(this.stepContainer);
    this.disposeUIElement();
  }
  private addActionButtonMap(target: ButtonName, content: HTMLElement) {
    if (!this.actionButtonContainer) {
      this.actionButtonContainer = this.logElements.createActionButtons();
      content.appendChild(this.actionButtonContainer);
    }
    const normButtonName = ButtonMap.normalizeButtonName(target); // 'triangle' or 'y' => 'action-up'
    const pushed = this.actionButtonContainer.querySelector(`.${normButtonName}`) as HTMLElement;
    pushed.classList.add("active");
    pushed.classList.remove("emboss");
  }
  reset() {
    this.logContainer.innerHTML = "";
  }
  onAndActionsStart(actions: Action[], context: ActionContext) {
    // console.log("log.onAndActionsStart:", actions, context);
    if (!context.ownerActionSet) {
      this.stepContainer = this.logElements.createStep();
      this.contentContainer = this.logElements.createStepContent();
      this.stepContainer.appendChild(this.contentContainer);
      this.logContainer.appendChild(this.stepContainer);
    }
  }
  onAndActionsEnd(actions: Action[], context: ActionContext) {
    // console.log("log.onAndActionsEnd:", actions, context);
    if (!context.ownerActionSet) {
      this.disposeUIElement();
    }
  }
  onOrActionsStart(actions: Action[], context: ActionContext) {
    // console.log("log.onOrActionsStart:", actions, context);
    if (!context.ownerActionSet) {
      this.stepContainer = this.logElements.createStep();
      this.contentContainer = this.logElements.createStepContent();
      this.stepContainer.appendChild(this.contentContainer);
      this.logContainer.appendChild(this.stepContainer);
    }
  }
  onOrActionsEnd(actions: Action[], context: ActionContext) {
    // console.log("log.onOrActionsEnd:", actions, context);
    if (!context.ownerActionSet) {
      this.disposeUIElement();
    }
  }
  playPushDown(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("log.playPushDown:", target, context);
    const isHolding = context.children.length > 0;
    const isActionButton = ButtonMap.isActionButton(target);
    this.withStepContent(context, content => {
      // single action
      if (context.ownerActionSet === undefined) {
        if (isActionButton) {
          this.addActionButtonMap(target, content);
        } else {
          content.appendChild(this.logElements.createButton(target));
        }
        if (isHolding) {
          content.appendChild(this.logElements.createText("を押したまま", "blue"));
        }
        return;
      }
      const isLastAction = context.actionSetIndex === context.ownerActionSet.actions.length - 1;

      // multiple action(AndActions)
      if (context.ownerActionSet instanceof AndActions) {
        const andActions = context.ownerActionSet;
        const ancestor = andActions.ownerActionSet;
        const isOrChild = ancestor instanceof OrActions; // like 'a' in Or(And(a,b), And(x,y))
        const isLastOrChild = ancestor && ancestor.actions.indexOf(context.ownerActionSet) === ancestor.actions.length - 1;
        if (isActionButton && !isOrChild) {
          this.addActionButtonMap(target, content);
        } else {
          content.appendChild(this.logElements.createButton(target));
        }
        if (isOrChild && isLastAction && !isLastOrChild) {
          content.appendChild(this.logElements.createText("もしくは", "blue"));
        }
        if (isHolding && isLastAction && isLastOrChild) {
          content.appendChild(this.logElements.createText("を押したまま", "blue"));
        }
        return;
      }
      // multiple action(OrActions)
      if (context.ownerActionSet instanceof OrActions) {
        content.appendChild(this.logElements.createButton(target));
        if (!isLastAction) {
          content.appendChild(this.logElements.createText("もしくは", "normal"));
        }
        if (isHolding && isLastAction) {
          content.appendChild(this.logElements.createText("を押したまま", "blue"));
        }
        return;
      }
    });
    return Promise.resolve();
  }
  playPushUp(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("log.playPushUp: %o, %o", target, context);
    const isHolding = context.children.length > 0;
    if (!isHolding) {
      return Promise.resolve();
    }
    this.withStepContent(context, content => {
      content.appendChild(this.logElements.createButton(target));
      if (context.ownerActionSet === undefined ||
        context.actionSetIndex === context.ownerActionSet.actions.length - 1) {
        content.appendChild(this.logElements.createText("を離す", "blue"));
      }
    });
    return Promise.resolve();
  }
  async playRotate(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`log.playRotate(${target}, ${fromAngle}, ${toAngle})`);
    const container = StickElementFactory.createStickContainer();
    const svg = StickElementFactory.createStickSVG(container, this.env.stickRadius, this.env.lineStrokeSize, this.env.arrowSize);
    const circle = StickElementFactory.createStickCircle(svg, this.env.stickRadius, this.env.stickColor, this.env.lineStrokeSize, this.env.lineStrokeColor, this.env.arrowSize);
    const label = StickElementFactory.createStickLabelSVG(target, svg, this.env.stickLabelPosLeft, this.env.stickLabelPosTop, this.env.stickLabelColor, this.env.stickLabelFontSize);
    this.withStepContent(context, content => {
      content.appendChild(container);
    });
    const effect = new RotateStickSVG(container, this.env, svg, circle, label);
    return effect.exec(fromAngle, toAngle, false);
  }
  async playMove(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`log.playMove(${target}, ${fromAngle}, ${toAngle})`);
    const container = StickElementFactory.createStickContainer();
    const svg = StickElementFactory.createStickSVG(container, this.env.stickRadius, this.env.lineStrokeSize, this.env.arrowSize);
    const circle = StickElementFactory.createStickCircle(svg, this.env.stickRadius, this.env.stickColor, this.env.lineStrokeSize, this.env.lineStrokeColor, this.env.arrowSize);
    const label = StickElementFactory.createStickLabelSVG(target, svg, this.env.stickLabelPosLeft, this.env.stickLabelPosTop, this.env.stickLabelColor, this.env.stickLabelFontSize);
    this.withStepContent(context, content => {
      content.appendChild(container);
    });
    const effect = new MoveStickSVG(this.env, svg, label);
    return effect.exec(fromAngle, toAngle, false);
  }
  async playSet(target: StickName, toAngle: number, drawArrow: boolean, context: ActionContext): Promise<any> {
    // console.log(`log.playSet(${target}, ${toAngle})`);
    const container = StickElementFactory.createStickContainer();
    const svg = StickElementFactory.createStickSVG(container, this.env.stickRadius, this.env.lineStrokeSize, this.env.arrowSize);
    const circle = StickElementFactory.createStickCircle(svg, this.env.stickRadius, this.env.stickColor, this.env.lineStrokeSize, this.env.lineStrokeColor, this.env.arrowSize);
    const label = StickElementFactory.createStickLabelSVG(target, svg, this.env.stickLabelPosLeft, this.env.stickLabelPosTop, this.env.stickLabelColor, this.env.stickLabelFontSize);
    this.withStepContent(context, content => {
      content.appendChild(container);
    });
    const effect = new SetStickSVG(this.env, svg, label);
    return effect.exec(toAngle, false);
  }
  playUnset(target: StickName, fromAngle: number, context: ActionContext): Promise<any> {
    // console.log(`log.playUnset(${target}, ${fromAngle})`);
    this.withStepContent(context, content => {
      const msg = this.logElements.createText(`${target.toUpperCase()}を離す`, "blue");
      content.appendChild(msg);
    });
    return Promise.resolve();
  }
  playTouch(target: StickName, context: ActionContext): Promise<any> {
    // console.log("log.playTouch: %s, %o", target, context);
    const msg = this.logElements.createText(`${target.toUpperCase()}の操作`, "blue");
    this.withStepContent(context, content => {
      content.append(msg);
    });
    const effect = new ShakeElement(msg, this.env);
    return effect.exec();
  }
  playText(text: string, group: ActionTextGroup, context: ActionContext): Promise<any> {
    // console.log(`log.playTex(${text})`);
    const color = this.selectActionGroupColor(group);
    const textElement = this.logElements.createText(text, color);
    this.withStepContent(context, content => {
      content.appendChild(textElement);
    });
    if (group === "error") {
      return new ShakeElement(textElement, this.env).exec();
    }
    return Promise.resolve();
  }
}