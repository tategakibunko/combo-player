import { SVG, Svg, Circle, Text } from '@svgdotjs/svg.js';
// import { StickName } from '../../combo-script';
import { StickName } from 'ts-combo-script';

export class StickElementFactory {
  static createStickContainer(): HTMLElement {
    const container = document.createElement("div");
    container.className = "svg-stick-container";
    return container;
  }

  static createStickSVG(container: HTMLElement, radius: number, strokeSize: number, arrowSize: number): Svg {
    const cornerSize = strokeSize / 2 + (arrowSize - strokeSize) / 2;
    const svgSize = radius * 2 + cornerSize * 2;
    return SVG()
      .addTo(container)
      .size(svgSize, svgSize);
  }

  static createStickLabelSVG(target: StickName, svg: Svg, left: number, top: number, color: string, fontSize: number): Text {
    const text = target === "lstick" ? "Ｌ" : "Ｒ";
    return svg.text(text).font({
      color: color,
      size: fontSize,
      weight: "bold",
    }).fill(color).move(left, top);
  }

  static createStickCircle(svg: Svg, radius: number, color: string, strokeSize: number, strokeColor: string, arrowSize: number): Circle {
    const cornerSize = strokeSize / 2 + (arrowSize - strokeSize) / 2;
    const circle = svg
      .circle(radius * 2)
      .move(cornerSize, cornerSize)
      .attr({
        fill: color,
        "stroke-width": strokeSize,
        "stroke-dasharray": `0 ${2 * Math.PI * radius}`,
      }).stroke({ color: strokeColor });
    return circle;
  }
}