export class Menu {
  constructor(
    private toggle = document.querySelector(".toggle") as HTMLElement,
    private menu = document.querySelector(".menu") as HTMLElement,
    private menuItems = document.querySelectorAll(".item") as NodeListOf<HTMLElement>,
  ) { }

  // Toggle mobile menu
  private toggleMenu(event: any) {
    this.menu.classList.toggle("active");
  }
  // Activate Submenu
  private createToggleItemListener(target: HTMLElement) {
    return (event: any) => {
      if (target.classList.contains("submenu-active")) {
        target.classList.remove("submenu-active");
      } else if (this.menu.querySelector(".submenu-active")) {
        this.menu.querySelector(".submenu-active")!.classList.remove("submenu-active");
        target.classList.add("submenu-active");
      } else {
        target.classList.add("submenu-active");
      }
    }
  }
  // Close Submenu From Anywhere
  private closeSubmenu(event: any) {
    let isClickInside = this.menu.contains(event.target);
    if (!isClickInside && this.menu.querySelector(".submenu-active")) {
      this.menu.querySelector(".submenu-active")!.classList.remove("submenu-active");
    }
  }

  setup() {
    this.toggle.addEventListener("click", evt => this.toggleMenu(evt), false);
    this.menuItems.forEach(item => {
      if (item.querySelector(".submenu")) {
        item.addEventListener("click", this.createToggleItemListener(item), false);
      }
      item.addEventListener("keypress", this.createToggleItemListener(item), false);
    });
    document.addEventListener("click", evt => this.closeSubmenu(evt), false);
  }
}