// import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, ActionPlayer } from '../../combo-script';
import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, ActionPlayer } from 'ts-combo-script';

// Elements required by pad-controller
export interface PadElements {
  actionUpButton: HTMLElement;
  actionRightButton: HTMLElement;
  actionDownButton: HTMLElement;
  actionLeftButton: HTMLElement;
  leftStick: HTMLElement;
  rightStick: HTMLElement;
  crossUp: HTMLElement;
  crossUpArrow: HTMLElement;
  crossRight: HTMLElement;
  crossRightArrow: HTMLElement;
  crossDown: HTMLElement;
  crossDownArrow: HTMLElement;
  crossLeft: HTMLElement;
  crossLeftArrow: HTMLElement;
  r1: HTMLElement;
  r2: HTMLElement;
  r3: HTMLElement;
  l1: HTMLElement;
  l2: HTMLElement;
  l3: HTMLElement;
}

// Elements required by log-controller
export interface LogElements {
  logContainer: HTMLElement;
  createStep: () => HTMLElement;
  createStepContent: () => HTMLElement;
  createArrowIcon: (target: ButtonName) => HTMLElement;
  createRotatedArrowIcon: (angle: number) => HTMLElement;
  createActionButtons: () => HTMLElement;
  createActionUpButton: (target: ButtonName) => HTMLElement;
  createActionRightButton: (target: ButtonName) => HTMLElement;
  createActionDownButton: (target: ButtonName) => HTMLElement;
  createActionLeftButton: (target: ButtonName) => HTMLElement;
  createOptionButton: (label: string) => HTMLElement;
  createStickButton: (label: string, color: string) => HTMLElement;
  createLabelButton: (text: string, color: string) => HTMLElement;
  createText: (text: string, color: string) => HTMLElement;
  createButton: (target: ButtonName) => HTMLElement;
}

export interface EffectEnv {
  durationRate: number;
  stickColor: string;
  stickLabelColor: string;
  stickLabelFontSize: number;
  stickLabelPosLeft: number;
  stickLabelPosTop: number;
  stickRadius: number;
  stickPaddingSize: number; // stickStrokeSize / 2 + (arrowSize - stickStrokeSize) / 2
  arrowSize: number;
  lineStrokeColor: string;
  lineStrokeSize: number;
  showHoldingStartPopup: boolean;
  showHoldingEndPopup: boolean;
  leftStickPushColor: string;
  rightStickPushColor: string;
}

export interface ActionEffect {
  exec: (...args: any[]) => Promise<void>;
}

export interface ButtonController {
  pushDown: (isHolding: boolean) => Promise<any>;
  pushUp: (fromHolding: boolean) => Promise<any>;
}

export interface StickController {
  rotate: (fromAngle: number, toAngle: number) => Promise<any>;
  set: (toAngle: number, drawArrow: boolean, isHolding: boolean) => Promise<any>;
  unset: (fromAngle: number) => Promise<any>;
  move: (fromAngle: number, toAngle: number) => Promise<any>;
  touch: () => Promise<any>;
}

export interface ActionController {
  reset: () => void;
  onAndActionsStart: (actions: Action[], context: ActionContext) => void;
  onAndActionsEnd: (actions: Action[], context: ActionContext) => void;
  onOrActionsStart: (actions: Action[], context: ActionContext) => void;
  onOrActionsEnd: (actions: Action[], context: ActionContext) => void;
  playPushDown: (target: ButtonName, context: ActionContext) => Promise<any>;
  playPushUp: (target: ButtonName, context: ActionContext) => Promise<any>;
  playRotate: (target: StickName, fromAngle: number, toAngle: number, context: ActionContext) => Promise<any>;
  playMove: (target: StickName, fromAngle: number, toAngle: number, context: ActionContext) => Promise<any>;
  playSet: (target: StickName, toAngle: number, drawArrow: boolean, context: ActionContext) => Promise<any>;
  playUnset: (target: StickName, fromAngle: number, context: ActionContext) => Promise<any>;
  playTouch: (target: StickName, context: ActionContext) => Promise<any>;
  playText: (text: string, group: ActionTextGroup, context: ActionContext) => Promise<any>;
}

export interface PluginStore {
  add: (name: string, entry: Plugin) => void;
  get: (name: string) => Plugin | undefined;
}

export interface PluginEntry {
  name: string;
  plugin: Plugin;
}

export interface Plugin {
  onAction: (context: PluginContext) => Promise<any>;
  onHoldStart: (context: PluginContext) => Promise<any>;
  onHoldEnd: (cointext: PluginContext) => Promise<any>;
}

export interface PluginContext {
  name: string;
  args: string[];
  player: ActionPlayer;
  actionContext: ActionContext;
}

export interface GameCommand {
  name: string;
  category?: string;
  combo: string;
}

export interface GameEntry {
  title: string;
  commands: GameCommand[];
}

export interface GameLoader {
  load: (name: string) => Promise<GameEntry>;
}
