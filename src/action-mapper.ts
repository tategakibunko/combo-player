// import { Action, AndActions, ActionMapper, PushAction, PushDownAction, PushUpAction } from '../../combo-script'
import { Action, AndActions, ActionMapper, PushAction, PushDownAction, PushUpAction } from 'ts-combo-script'
import { ButtonMap } from './button-map';

export class ArrowKeysComposer implements ActionMapper<Action[]> {
  visit(action: Action): Action[] {
    if (action instanceof AndActions) {
      const actions = this.composeCrossKeys(action.actions);
      return [new AndActions(actions, action.ownerActionSet, action.children, action.ownerActionSet)];
    }
    return [action];
  }
  private composeCrossKeys(actions: Action[]): Action[] {
    type GroupedAction = {
      crossPushActions: PushAction[],
      crossPushDownActions: PushDownAction[],
      crossPushUpActions: PushUpAction[],
      otherActions: Action[]
    };
    const groupedAction = actions.reduce((acm: GroupedAction, action: Action) => {
      if (action instanceof PushAction && ButtonMap.isArrowButton(action.target)) {
        return { ...acm, crossPushActions: acm.crossPushActions.concat(action as PushAction) };
      }
      if (action instanceof PushDownAction && ButtonMap.isArrowButton(action.target)) {
        return { ...acm, crossPushDownActions: acm.crossPushDownActions.concat(action as PushDownAction) };
      }
      if (action instanceof PushUpAction && ButtonMap.isArrowButton(action.target)) {
        return { ...acm, crossPushUpActions: acm.crossPushUpActions.concat(action as PushUpAction) };
      }
      return { ...acm, otherActions: acm.otherActions.concat(action) };
    }, { crossPushActions: [], crossPushDownActions: [], crossPushUpActions: [], otherActions: [] } as GroupedAction);
    let composedActions = groupedAction.otherActions;
    if (groupedAction.crossPushActions.length > 0) {
      const buttonName = groupedAction.crossPushActions.map(action => action.target).join("-");
      const push = groupedAction.crossPushActions[0];
      composedActions = composedActions.concat(
        new PushAction(buttonName, push.ownerActionSet, push.children, push.holder)
      );
    }
    if (groupedAction.crossPushDownActions.length > 0) {
      const buttonName = groupedAction.crossPushDownActions.map(action => action.target).join("-");
      const pushDown = groupedAction.crossPushDownActions[0];
      composedActions = composedActions.concat(
        new PushDownAction(buttonName, pushDown.ownerActionSet, pushDown.children, pushDown.holder)
      );
    }
    if (groupedAction.crossPushUpActions.length > 0) {
      const buttonName = groupedAction.crossPushUpActions.map(action => action.target).join("-");
      const pushUp = groupedAction.crossPushUpActions[0];
      composedActions = composedActions.concat(
        new PushUpAction(buttonName, pushUp.ownerActionSet, pushUp.children, pushUp.ownerActionSet)
      );
    }
    return composedActions;
  }
}
