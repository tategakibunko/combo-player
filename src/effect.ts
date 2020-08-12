import anime from 'animejs';
import { ActionEffect, EffectEnv } from './types';
import { Circle, Polygon, Svg, Line, Text } from '@svgdotjs/svg.js'

const createStickArrow = (svg: Svg, arrowSize: number, color: string): Polygon => {
  return svg
    .polygon(`0, ${arrowSize} ${arrowSize}, ${arrowSize}, ${arrowSize / 2}, 0`)
    .fill(color)
    .hide();
}

export const a2rad = (angle: number): number => {
  return angle * Math.PI / 180;
}

export const rad2a = (rad: number): number => {
  return rad * 180 / Math.PI;
}

export const a2cir = (angle: number, radius: number) => {
  return a2rad(angle) * radius;
}

export class PopupLabel implements ActionEffect {
  constructor(
    private container: HTMLElement,
    private env: EffectEnv,
  ) { }

  async exec(message: string, duration = 500, color = "red"): Promise<void> {
    const $label = document.createElement("div");
    $label.className = `ui small left pointing ${color} basic label`;
    $label.innerHTML = message;
    $label.style.position = "absolute";
    $label.style.opacity = "0";
    $label.style.minWidth = "100px";
    $label.style.zIndex = "10000";
    this.container.appendChild($label);

    await anime({
      targets: $label,
      duration: duration * this.env.durationRate,
      opacity: 1,
    }).finished;

    this.dispose();
    return Promise.resolve();
  }

  dispose() {
    const $label = this.container.querySelector(".label");
    if ($label) {
      this.container.removeChild($label);
    }
  }
}

export class ShakeElement implements ActionEffect {
  constructor(private container: HTMLElement, private env: EffectEnv) { }
  exec(duration = 300): Promise<void> {
    return anime({
      targets: this.container,
      duration: duration * this.env.durationRate,
      keyframes: [
        { translateX: 5 },
        { translateX: -5 },
        { translateX: 2 },
        { translateX: -2 },
        { translateX: 0 },
      ],
      elasticity: 1000
    }).finished;
  }
}


export class SetCrossKeyArrow implements ActionEffect {
  constructor(private container: HTMLElement, private env: EffectEnv) { }

  exec(duration = 500): Promise<void> {
    this.container.classList.add("active");
    return anime({ duration: duration * this.env.durationRate }).finished;
  }
}

export class UnsetCrossKeyArrow implements ActionEffect {
  constructor(private container: HTMLElement, private env: EffectEnv) { }

  exec(): Promise<void> {
    this.container.classList.remove("active");
    return Promise.resolve();
  }
}

export class PushDownButton implements ActionEffect {
  constructor(
    private container: HTMLElement,
    private env: EffectEnv,
  ) { }

  exec(isEmbossEnabled: boolean, duration = 200): Promise<void> {
    if (isEmbossEnabled) {
      this.container.classList.remove("emboss");
      this.container.classList.add("active");
    }
    return anime({
      targets: this.container,
      duration: duration * this.env.durationRate,
      translateY: 2,
    }).finished;
  }
}

export class PushUpButton implements ActionEffect {
  constructor(
    private container: HTMLElement,
    private env: EffectEnv,
  ) { }

  async exec(isEmbossEnabled: boolean, duration = 200): Promise<void> {
    // await anime({ duration: 10 * this.env.durationRate }).finished;
    if (isEmbossEnabled) {
      this.container.classList.add("emboss");
      this.container.classList.remove("active");
    }
    return anime({
      targets: this.container,
      duration: duration * this.env.durationRate,
      translateY: 0
    }).finished;
  }
}

export class RotateStickSVG implements ActionEffect {
  constructor(
    private container: HTMLElement,
    private env: EffectEnv,
    private svg: Svg,
    private circle: Circle,
    private label: Text | undefined = undefined,
  ) { }

  private createDashArray(writeAngle: number, totalAngle: number, startAngle: number, isReverse: boolean): string {
    const cirSkipStart = a2cir(startAngle, this.env.stickRadius);
    const cirStroke = a2cir(writeAngle, this.env.stickRadius);
    const cirTotalStroke = a2cir(totalAngle, this.env.stickRadius);
    const cir360 = a2cir(360, this.env.stickRadius);
    if (isReverse) {
      const cirSkipInside = cirTotalStroke - cirStroke;
      return `0 ${cirSkipStart + cirSkipInside} ${cirStroke} ${cir360 - cirSkipStart - cirSkipInside - cirStroke}`;
    }
    return `0 ${cirSkipStart} ${cirStroke} ${cir360 - cirStroke - cirSkipStart}`;
  }

  async exec(fromAngle: number, toAngle: number, volatile: boolean, durationRotate = 300, durationArrow = 100): Promise<any> {
    while (fromAngle < 0) fromAngle += 360;
    while (toAngle < 0) toAngle += 360;
    const isReverse = toAngle < fromAngle;
    const dAngle = Math.abs(toAngle - fromAngle);
    const startAngle = Math.min(fromAngle, toAngle);
    this.circle.attr({
      "stroke-dasharray": this.createDashArray(0, dAngle, startAngle, isReverse),
    });

    const strokeState = { angle: 0 };
    await anime({
      targets: strokeState,
      angle: dAngle,
      easing: "linear",
      duration: durationRotate * this.env.durationRate,
      update: () => {
        this.circle.attr({
          "stroke-dasharray": this.createDashArray(strokeState.angle, dAngle, startAngle, isReverse),
        });
      }
    }).finished;

    const rotAngle = toAngle > fromAngle ? toAngle + 180 : toAngle;
    const rad = a2rad(toAngle);
    const dstX = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.cos(rad);
    const dstY = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.sin(rad);
    const arrowX = dstX - this.env.arrowSize / 2;
    const arrowY = dstY - this.env.arrowSize / 2;
    const arrow = createStickArrow(this.svg, this.env.arrowSize, this.env.lineStrokeColor);
    arrow.move(arrowX, arrowY).rotate(rotAngle, dstX, dstY).show();
    await anime({ duration: durationArrow * this.env.durationRate }).finished; // show arrow for a while.
    if (volatile) {
      this.circle.attr({
        "stroke-dasharray": `0 ${a2cir(360, this.env.stickRadius)}`,
      });
      arrow.remove();
    }
    return Promise.resolve();
  }
}

export class MoveStickSVG implements ActionEffect {
  constructor(
    private env: EffectEnv,
    private svg: Svg,
    private label: Text | undefined = undefined,
  ) { }

  async exec(fromAngle: number, toAngle: number, volatile: boolean, durationMove = 300, durationArrow = 100): Promise<any> {
    const fromRad = a2rad(fromAngle), toRad = a2rad(toAngle);
    const fromX = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.cos(fromRad);
    const fromY = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.sin(fromRad);
    const toX = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.cos(toRad);
    const toY = this.env.stickPaddingSize + this.env.stickRadius + this.env.stickRadius * Math.sin(toRad);
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const line = this.svg.line(fromX, fromY, toX, toY).stroke({ width: this.env.lineStrokeSize, color: this.env.lineStrokeColor, linecap: "round" });
    line.attr({
      "stroke-dasharray": `0 ${lineLength}`,
    });
    const lineAnime = {
      drawLen: 0
    };
    await anime({
      targets: lineAnime,
      drawLen: lineLength,
      easing: "linear",
      round: 1,
      duration: durationMove * this.env.durationRate,
      update: () => {
        line.attr({
          "stroke-dasharray": `${lineAnime.drawLen} ${lineLength - lineAnime.drawLen}`,
        });
      }
    }).finished;
    const rotRad = Math.atan2(deltaY, deltaX) + Math.PI / 2;
    const arrowX = toX - this.env.arrowSize / 2, arrowY = toY - this.env.arrowSize / 2;
    const arrow = createStickArrow(this.svg, this.env.arrowSize, this.env.lineStrokeColor);
    arrow.move(arrowX, arrowY).rotate(rad2a(rotRad), toX, toY).show();
    await anime({ duration: durationArrow * this.env.durationRate }).finished;
    if (volatile) {
      arrow.remove();
      line.remove();
    }
    return Promise.resolve();
  }

  dispose() { }
}

export class SetStickSVG implements ActionEffect {
  constructor(
    private env: EffectEnv,
    private svg: Svg,
    private label: Text | undefined = undefined,
    private line: Line | undefined = undefined,
    private arrow: Polygon | undefined = undefined,
  ) { }

  async exec(toAngle: number, volatile: boolean, durationSet = 300, durationArrow = 100): Promise<any> {
    const toRad = a2rad(toAngle);
    const centerX = this.env.stickPaddingSize + this.env.stickRadius;
    const centerY = this.env.stickPaddingSize + this.env.stickRadius;
    const toX = centerX + this.env.stickRadius * Math.cos(toRad);
    const toY = centerY + this.env.stickRadius * Math.sin(toRad);
    this.line = this.svg.line(centerX, centerY, toX, toY).stroke({ width: this.env.lineStrokeSize, color: this.env.lineStrokeColor, linecap: "round" });
    this.line.attr({
      "stroke-dasharray": `0 ${this.env.stickRadius}`,
    });
    const lineAnime = {
      drawLen: 0
    };
    await anime({
      targets: lineAnime,
      drawLen: this.env.stickRadius,
      easing: "linear",
      round: 1,
      duration: durationSet * this.env.durationRate,
      update: () => {
        this.line!.attr({
          "stroke-dasharray": `${lineAnime.drawLen} ${this.env.stickRadius - lineAnime.drawLen}`,
        });
      }
    }).finished;
    this.arrow = createStickArrow(this.svg, this.env.arrowSize, this.env.lineStrokeColor);
    const arrowAngle = 90 + toAngle;
    const arrowX = toX - this.env.arrowSize / 2, arrowY = toY - this.env.arrowSize / 2;
    this.arrow.move(arrowX, arrowY).rotate(arrowAngle, toX, toY).show();
    await anime({ duration: durationArrow * this.env.durationRate }).finished; // show arrow for a while
    if (volatile) {
      this.dispose();
    }
    return Promise.resolve();
  }

  dispose() {
    if (this.line) this.line.remove();
    if (this.arrow) this.arrow.remove();
  }
}
