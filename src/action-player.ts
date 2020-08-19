// import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, ActionPlayer } from '../../combo-script';
import { Action, ActionTextGroup, ActionContext, ButtonName, StickName, ActionPlayer } from 'ts-combo-script';
import { EffectEnv, PadElements, LogElements, ActionController, PluginStore } from './types';
import { CsPadController } from './pad-controller';
import { CsLogController } from './log-controller';

export class CsActionPlayer implements ActionPlayer {
  constructor(
    public padElements: PadElements,
    public logElements: LogElements,
    public effectEnv: EffectEnv,
    private pluginStore: PluginStore,
    public pad: ActionController = new CsPadController(padElements, effectEnv),
    public log: ActionController = new CsLogController(logElements, effectEnv),
  ) { }

  reset() {
    this.pad.reset();
    this.log.reset();
  }

  async visitPush(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log(`player.visitPush(${target})`);
    await this.visitPushDown(target, context);
    return this.visitPushUp(target, context);
  }
  visitPushDown(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("player.visitPushDown:%o, %o", target, context);
    return Promise.all([
      this.pad.playPushDown(target, context),
      this.log.playPushDown(target, context),
    ]);
  }
  visitPushUp(target: ButtonName, context: ActionContext): Promise<any> {
    // console.log("player.visitPushUp: %o, %o", target, context);
    return Promise.all([
      this.pad.playPushUp(target, context),
      this.log.playPushUp(target, context),
    ]);
  }
  visitRotate(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`player.visitRotate(${target}, ${fromAngle}, ${toAngle})`);
    return Promise.all([
      this.pad.playRotate(target, fromAngle, toAngle, context),
      this.log.playRotate(target, fromAngle, toAngle, context),
    ]);
  }
  visitMove(target: StickName, fromAngle: number, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`player.visitMove(${target}, ${fromAngle}, ${toAngle})`);
    return Promise.all([
      this.pad.playMove(target, fromAngle, toAngle, context),
      this.log.playMove(target, fromAngle, toAngle, context),
    ]);
  }
  visitSet(target: StickName, toAngle: number, context: ActionContext): Promise<any> {
    // console.log(`player.visitSet(${target}, ${toAngle})`);
    return Promise.all([
      this.pad.playSet(target, toAngle, true, context),
      this.log.playSet(target, toAngle, true, context),
    ]);
  }
  visitUnset(target: StickName, fromAngle: number, context: ActionContext): Promise<any> {
    // console.log(`player.visitUnset(${target}, ${fromAngle})`);
    return Promise.all([
      this.pad.playUnset(target, fromAngle, context),
      this.log.playUnset(target, fromAngle, context),
    ]);
  }
  visitTouch(target: StickName, context: ActionContext): Promise<any> {
    return Promise.all([
      this.pad.playTouch(target, context),
      this.log.playTouch(target, context),
    ]);
  }
  async visitAndActions(actions: Action[], context: ActionContext): Promise<any> {
    // console.log("player.visitAndActions:", actions);
    this.log.onAndActionsStart(actions, context);
    this.pad.onAndActionsStart(actions, context);
    const promise = await Promise.all(actions.map(action => action.acceptPlayer(this)));
    this.log.onAndActionsEnd(actions, context);
    this.pad.onAndActionsEnd(actions, context);
    return promise;
  }
  async visitOrActions(actions: Action[], context: ActionContext): Promise<any> {
    // console.log("player.visitOrActions:", actions);
    this.log.onOrActionsStart(actions, context);
    this.pad.onOrActionsStart(actions, context);
    const promise = await Promise.all(actions.map(action => action.acceptPlayer(this)));
    this.log.onOrActionsEnd(actions, context);
    this.pad.onOrActionsEnd(actions, context);
    return promise;
  }
  visitText(text: string, group: ActionTextGroup, context: ActionContext): Promise<any> {
    // console.log(`player.visitText(${text})`);
    return Promise.all([
      this.pad.playText(text, group, context),
      this.log.playText(text, group, context),
    ]);
  }
  visitPlugin(name: string, args: string[], context: ActionContext): Promise<any> {
    // console.log("player.visitPlugin:", pluginAction);
    const plugin = this.pluginStore.get(name);
    if (plugin) {
      return plugin.onAction({ player: this, name, args, actionContext: context });
    }
    return this.log.playText(`undefined plugin:${name}`, "error", context);
  }
  visitPluginHoldStart(name: string, args: string[], context: ActionContext): Promise<any> {
    // console.log(`player.visitPluginHoldStart:${name}`);
    const plugin = this.pluginStore.get(name);
    if (plugin) {
      return plugin.onHoldStart({ player: this, name, args, actionContext: context });
    }
    return this.log.playText(`undefined plugin:${name}(hold start)`, "error", context);
  }
  visitPluginHoldEnd(name: string, args: string[], context: ActionContext): Promise<any> {
    // console.log(`player.visitPluginHoldEnd:${name}`);
    const plugin = this.pluginStore.get(name);
    if (plugin) {
      return plugin.onHoldEnd({ player: this, name, args, actionContext: context });
    }
    return this.log.playText(`undefined plugin:${name}(hold end)`, "error", context);
  }
}

