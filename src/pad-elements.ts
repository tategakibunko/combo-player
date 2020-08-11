import { PadElements } from "./types";

export class CsPadElements implements PadElements {
  constructor(
    public actionUpButton = document.getElementById("action-up-button") as HTMLElement,
    public actionRightButton = document.getElementById("action-right-button") as HTMLElement,
    public actionDownButton = document.getElementById("action-down-button") as HTMLElement,
    public actionLeftButton = document.getElementById("action-left-button") as HTMLElement,
    public leftStick = document.getElementById("left-stick-container") as HTMLElement,
    public rightStick = document.getElementById("right-stick-container") as HTMLElement,
    public crossUp = document.getElementById("cross-key-up") as HTMLElement,
    public crossUpArrow = crossUp.querySelector("i.arrow") as HTMLElement,
    public crossRight = document.getElementById("cross-key-right") as HTMLElement,
    public crossRightArrow = crossRight.querySelector("i.arrow") as HTMLElement,
    public crossDown = document.getElementById("cross-key-down") as HTMLElement,
    public crossDownArrow = crossDown.querySelector("i.arrow") as HTMLElement,
    public crossLeft = document.getElementById("cross-key-left") as HTMLElement,
    public crossLeftArrow = crossLeft.querySelector("i.arrow") as HTMLElement,
    public r1 = document.getElementById("r1") as HTMLElement,
    public r2 = document.getElementById("r2") as HTMLElement,
    public r3 = rightStick,
    public l1 = document.getElementById("l1") as HTMLElement,
    public l2 = document.getElementById("l2") as HTMLElement,
    public l3 = leftStick,
  ) { }
}

