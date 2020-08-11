import {
  StickController,
  EffectEnv,
} from './types';

import {
  ShakeElement,
  RotateStickSVG,
  MoveStickSVG,
  SetStickSVG,
} from './effect';
import { StickElementFactory } from './stick-element-factory';

export class CsStickController implements StickController {
  constructor(
    private stickElement: HTMLElement,
    private env: EffectEnv,
    private svg = StickElementFactory.createStickSVG(stickElement, env.stickRadius, env.lineStrokeSize, env.arrowSize),
    private circle = StickElementFactory.createStickCircle(svg, env.stickRadius, env.stickColor, env.lineStrokeSize, env.lineStrokeColor, env.arrowSize),
    private holdingStick: SetStickSVG | undefined = undefined,
  ) { }

  async set(angle: number, drawArrow: boolean, isHolding: boolean): Promise<any> {
    const setStick = new SetStickSVG(this.env, this.svg);
    if (isHolding) {
      this.holdingStick = setStick;
    }
    return setStick.exec(angle, !isHolding);
  }

  async unset(angle: number): Promise<any> {
    if (this.holdingStick) {
      this.holdingStick.dispose();
    }
    return Promise.resolve();
  }

  async rotate(fromAngle: number, toAngle: number): Promise<any> {
    const rotateStick = new RotateStickSVG(this.stickElement, this.env, this.svg, this.circle);
    return rotateStick.exec(fromAngle, toAngle, true);
  }

  async move(fromAngle: number, toAngle: number): Promise<any> {
    const moveStick = new MoveStickSVG(this.env, this.svg);
    return moveStick.exec(fromAngle, toAngle, true);
  }

  async touch(): Promise<any> {
    const shake = new ShakeElement(this.stickElement, this.env);
    return shake.exec();
  }
}

