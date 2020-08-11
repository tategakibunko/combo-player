import { PluginContext, PluginEntry } from './types';
// import { StickName } from '../../combo-script';
import { StickName } from 'ts-combo-script';

// tiny example plugin
const join: PluginEntry = {
  name: "join",
  plugin: {
    onAction: (ctx: PluginContext): Promise<any> => {
      return ctx.player.visitText(ctx.args.join(" "), "info", ctx.actionContext);
    },
    onHoldStart: (ctx: PluginContext): Promise<any> => {
      return ctx.player.visitText(ctx.args.join(" ") + "(holding)", "info", ctx.actionContext);
    },
    onHoldEnd: (ctx: PluginContext): Promise<any> => {
      return Promise.resolve();
    },
  }
};

// set and rotate at the same time.
const createSetRotate = (stickName: StickName, pluginName: string): PluginEntry => {
  return {
    name: pluginName,
    plugin: {
      onAction: async (ctx: PluginContext): Promise<any> => {
        const startAngle = parseInt(ctx.args[0]);
        const endAngle = parseInt(ctx.args[1]);
        const actionPlayer = ctx.player;
        await actionPlayer.visitSet(stickName, startAngle, ctx.actionContext);
        return actionPlayer.visitRotate(stickName, startAngle, endAngle, ctx.actionContext);
      },
      onHoldStart: (ctx: PluginContext): Promise<any> => {
        throw new Error("can't hold this action");
      },
      onHoldEnd: (ctx: PluginContext): Promise<any> => {
        throw new Error("can't hold this action");
      }
    }
  };
}

export const PluginEntries: PluginEntry[] = [
  join,
  createSetRotate("lstick", "setrotate"),
  createSetRotate("lstick", "setrotatel"),
  createSetRotate("rstick", "setrotater"),
];

