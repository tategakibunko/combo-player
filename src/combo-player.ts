// import { compile, Ast, Action, ActionPlayer, ValidationError, CsAst, TextAction, ActionValidator, ActionMapper } from '../../combo-script';
import { compile, Ast, Action, ActionPlayer, ValidationError, CsAst, TextAction, ActionValidator, ActionMapper } from 'ts-combo-script';
import { PadElements, LogElements, EffectEnv, PluginStore, Plugin } from './types';
import { CsActionPlayer } from './action-player';
import { CsPadElements } from './pad-elements';
import { CsLogElements } from './log-elements';
import { CsEffectEnv } from './effect-env';
import { CsPluginStore } from './plugin-store';
import { ArrowKeysComposer } from './action-mapper';
import { CrossKeyValidator, ComposedCrossKeyValidator } from './validators';

export class ComboPlayer {
  constructor(
    private padElements: PadElements = new CsPadElements(),
    private logElements: LogElements = new CsLogElements(),
    private effectEnv: EffectEnv = { ...CsEffectEnv },
    private pluginStore: PluginStore = new CsPluginStore(),
    private player: ActionPlayer = new CsActionPlayer(padElements, logElements, effectEnv, pluginStore),
    private mappers: ActionMapper<Action[]>[] = [],
    private validatorFactory: (ast: Ast) => ActionValidator[] = (ast) => {
      return []
    }
  ) { }

  addPlugin(name: string, entry: Plugin) {
    this.pluginStore.add(name, entry);
  }

  setSpeed(speedRate: number) {
    if (speedRate > 0) {
      this.effectEnv.durationRate = 1 / speedRate;
    }
  }

  reset() {
    this.player.reset();
  }

  private createErrorAst(errors: ValidationError[]): Ast {
    const error = errors.map(error => error.errorMessage).join("\n");
    return new CsAst([
      new TextAction(error, "error")
    ]);
  }

  private mapAst(ast: Ast, mappers: ActionMapper<Action[]>[]): Ast {
    return mappers.reduce((ast, mapper) => ast.acceptActionMapper(mapper), ast);
  }

  private validateAst(ast: Ast, validators: ActionValidator[]): ValidationError[] {
    return validators.reduce((errors, validator) => {
      const errors2 = ast.acceptActionValidator(validator);
      return errors.concat(errors2);
    }, [] as ValidationError[]);
  }

  play(script: string): Promise<any> {
    this.player.reset();
    let { ast, errors } = compile(script);

    // check impossible cross key combination like (left, right), (up, down) etc.
    errors = errors.concat(this.validateAst(ast, [new CrossKeyValidator(ast)]));

    // rewrite cross key format from (key1, key2) to "key1-key2".
    ast = this.mapAst(ast, [new ArrowKeysComposer()]);

    // check impossible composed cross key format like 'left-right'.
    errors = errors.concat(this.validateAst(ast, [new ComposedCrossKeyValidator(ast)]));

    // apply DI mapper
    ast = this.mappers.reduce((ast, mapper) => ast.acceptActionMapper(mapper), ast);

    // apply DI validator
    errors = this.validatorFactory(ast).reduce((errors, validator) => errors.concat(ast.acceptActionValidator(validator)), errors);

    if (errors.length > 0) {
      errors.forEach(error => {
        console.error(`Code:${error.errorCode}, ${error.errorMessage}`);
      });
      return this.createErrorAst(errors).acceptActionPlayer(this.player);
    }
    return ast.acceptActionPlayer(this.player);
  }
}

