// import { ActionValidator, Action, AndActions, ValidationContext, PushAction, PushDownAction, PushUpAction, ButtonName, ValidationError, Ast } from '../../combo-script';
import { ActionValidator, Action, AndActions, ValidationContext, PushAction, PushDownAction, PushUpAction, ButtonName, ValidationError, Ast } from 'ts-combo-script';

/*
  check inconsistent cross-key push

  [example]
  (left, up) => ok!
  (left, down) => ok!
  (left, right) => error!
  (left, left) => error!
*/
type PushGroup = PushDownAction | PushUpAction;

const isPushGroup = (action: Action): action is PushGroup => {
  return (action instanceof PushAction || action instanceof PushDownAction || action instanceof PushUpAction);
};

const CrossKeys = ["up", "right", "down", "left"];
const CrossKeyToAngle: { [key: string]: number } = { "up": 270, "right": 0, "down": 90, "left": 180 };

const isCrossKeyPush = (action: Action): boolean => {
  if (!isPushGroup(action)) {
    return false;
  }
  return CrossKeys.indexOf(action.target) >= 0;
}

const isComposedCrossKeyPush = (action: Action): boolean => {
  if (!isPushGroup(action)) {
    return false;
  }
  return action.target.split("-").every(key => CrossKeys.indexOf(key) >= 0);
}

const keySetError = (keys: ButtonName[]): string => {
  const keyList = keys.map(key => `'${key}'`).join(" and ");
  return `${keyList} can't be pushed at the same time.`
}

export class CrossKeyValidator implements ActionValidator {
  constructor(private ast: Ast) { }

  private validate(keys: ButtonName[], context: ValidationContext): ValidationContext {
    const normalKeys = keys.filter(key => !key.includes("-"));
    if (normalKeys.length >= 3) {
      return {
        ...context,
        errors: context.errors.concat({ ast: this.ast, errorCode: "E_PUSH", errorMessage: keySetError(normalKeys) })
      };
    }
    if (normalKeys.length !== 2) {
      return context;
    }
    const key1 = normalKeys[0], key2 = normalKeys[1];
    // Unable to push opposite side of cross key!
    if ((CrossKeyToAngle[key1] - CrossKeyToAngle[key2]) % 180 === 0) {
      return {
        ...context,
        errors: context.errors.concat({ ast: this.ast, errorCode: "E_PUSH", errorMessage: keySetError(normalKeys) })
      };
    }
    return context;
  }
  visit(action: Action, context: ValidationContext): ValidationContext {
    if (action instanceof AndActions) {
      const keys = (action.actions.filter(isCrossKeyPush) as PushGroup[]).map(key => key.target);
      return this.validate(keys, context);
    }
    return context;
  }
}

export class ComposedCrossKeyValidator implements ActionValidator {
  constructor(private ast: Ast) { }

  private validate(keys: ButtonName[], context: ValidationContext): ValidationContext {
    let errors: ValidationError[] = [];
    if (keys.length >= 2) {
      errors.push({ ast: this.ast, errorCode: "E_PUSH", errorMessage: keySetError(keys) });
    }
    return {
      ...context,
      errors: context.errors.concat(errors)
    };
  }
  visit(action: Action, context: ValidationContext): ValidationContext {
    if (action instanceof AndActions) {
      const keys = (action.actions.filter(isComposedCrossKeyPush) as PushGroup[]).map(key => key.target);
      return this.validate(keys, context);
    }
    return context;
  }
}

