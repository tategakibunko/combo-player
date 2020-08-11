// import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, OrActions, AndActions, ActionSet } from '../../combo-script';
import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, OrActions, AndActions, ActionSet } from 'ts-combo-script';

import {
  PadElements,
  ActionController,
  StickController,
  ButtonController,
  EffectEnv,
} from './types';

import { CsButtonController, CsStickButtonController } from './button-controller';
import { CsStickController } from './stick-controller';
import { CsCrossKeyController } from './cross-key-controller';

export class CsPadController implements ActionController {
  constructor(
    public elms: PadElements,
    public env: EffectEnv,
    public actionUpButton = new CsButtonController(elms.actionUpButton, env, true),
    public actionRightButton = new CsButtonController(elms.actionRightButton, env, true),
    public actionDownButton = new CsButtonController(elms.actionDownButton, env, true),
    public actionLeftButton = new CsButtonController(elms.actionLeftButton, env, true),
    public leftStick = new CsStickController(elms.leftStick, env),
    public rightStick = new CsStickController(elms.rightStick, env),
    public l1 = new CsButtonController(elms.l1, env, true),
    public l2 = new CsButtonController(elms.l2, env, true),
    public l3 = new CsStickButtonController(elms.l3, elms.l3.querySelector("circle")!, env, false, env.stickColor, env.leftStickPushColor),
    public r1 = new CsButtonController(elms.r1, env, true),
    public r2 = new CsButtonController(elms.r2, env, true),
    public r3 = new CsStickButtonController(elms.r3, elms.r3.querySelector("circle")!, env, false, env.stickColor, env.rightStickPushColor),
    public crossUp = new CsCrossKeyController(elms.crossUp, elms.crossUpArrow, env),
    public crossRight = new CsCrossKeyController(elms.crossRight, elms.crossRightArrow, env),
    public crossDown = new CsCrossKeyController(elms.crossDown, elms.crossDownArrow, env),
    public crossLeft = new CsCrossKeyController(elms.crossLeft, elms.crossLeftArrow, env),
  ) { }

  private selectButtons(buttonName: ButtonName): ButtonController[] {
    switch (buttonName) {
      case 'up': return [this.crossUp];
      case 'right': return [this.crossRight];
      case 'down': return [this.crossDown];
      case 'left': return [this.crossLeft];
      case 'up-right': case 'right-up': return [this.crossUp, this.crossRight];
      case 'down-right': case 'right-down': return [this.crossDown, this.crossRight];
      case 'down-left': case 'left-down': return [this.crossDown, this.crossLeft];
      case 'up-left': case 'left-up': return [this.crossUp, this.crossLeft];
      case 'action-up':
      case 'actionup':
      case 'triangle':
      case 'y':
        return [this.actionUpButton];
      case 'action-right':
      case 'actionright':
      case 'circle':
      case 'b':
        return [this.actionRightButton];
      case 'action-down':
      case 'actiondown':
      case 'cross':
      case 'a':
        return [this.actionDownButton];
      case 'action-left':
      case 'actionleft':
      case 'square':
      case 'x':
        return [this.actionLeftButton];
      case 'l1': return [this.l1];
      case 'l2': return [this.l2];
      case 'l3': return [this.l3];
      case 'r1': return [this.r1];
      case 'r2': return [this.r2];
      case 'r3': return [this.r3];
    }
    console.error(`Unsupported button name:${buttonName}`);
    return [];
  }

  private selectStick(stickName: StickName): StickController {
    switch (stickName) {
      case 'lstick': return this.leftStick;
      case 'rstick': return this.rightStick;
    }
  }

  private isFirstAndActionsInOrActions(set: ActionSet, parentSet: ActionSet): boolean {
    return (set instanceof AndActions && parentSet instanceof OrActions && parentSet.actions.indexOf(set) === 0);
  }

  reset() {
  }

  onAndActionsStart(actions: Action[], context: ActionContext) {
  }

  onAndActionsEnd(actions: Action[], context: ActionContext) {
  }

  onOrActionsStart(actions: Action[], context: ActionContext) {
  }

  onOrActionsEnd(actions: Action[], context: ActionContext) {
  }

  async playPushDown(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("pad.playPushDown:", target, context);
    const buttons = this.selectButtons(target);
    const isHolding = context.children.length > 0;
    return Promise.all(buttons.map(button => button.pushDown(isHolding)));
  }

  async playPushUp(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("pad.playPushUp:", target, context);
    const buttons = this.selectButtons(target);
    const fromHolding = context.children.length > 0;
    return await Promise.all(buttons.map(button => button.pushUp(fromHolding)));
  }

  async playRotate(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`pad.playRotate(${target}, ${fromAngle}, ${toAngle})`);
    return this.selectStick(target).rotate(fromAngle, toAngle)
  }

  async playMove(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`pad.playMove(${target}, ${fromAngle}, ${toAngle})`);
    return this.selectStick(target).move(fromAngle, toAngle);
  }

  async playSet(target: StickName, toAngle: number, drawArrow: boolean, context: ActionContext): Promise<any> {
    this.reset();
    // console.log(`pad.playSet(${target}, ${toAngle})`);
    return this.selectStick(target).set(toAngle, drawArrow, context.children.length > 0);
  }

  async playUnset(target: StickName, fromAngle: number, context: ActionContext): Promise<any> {
    this.reset();
    // console.log(`pad.playUnset(${target}, ${fromAngle})`);
    return this.selectStick(target).unset(fromAngle);
  }

  async playTouch(target: StickName, context: ActionContext): Promise<any> {
    return this.selectStick(target).touch();
  }

  async playText(text: string, group: ActionTextGroup, context: ActionContext): Promise<any> {
    return Promise.resolve();
  }
}

