import { LightningElement, track } from "lwc";

export default class RecordLookup extends LightningElement {
  @track items = [];
  @track data = [];
  @track listboxdiv = "testid";
  @track descendant = "";
  @track ariaexp = false;
  @track selectedIndex = -1;
  @track allowClose = true;

  RecordLookup() {
    for (let index = 0; index < 100; index++) {
      this.items.push({
        name: "Sathya test " + index
      });
    }
  }
  connectedCallback() {
    this.listener = () => {
      this.closelistBox(this);
    };
    window.addEventListener("scroll", this.listener);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.listener);
  }

  handleFocus() {
    this.ariaexp = true;
    this.listboxdiv = this.template.querySelector(".mylookup")?.id;
    this.template
      .querySelector(".inputtype")
      .setAttribute("aria-controls", this.listboxdiv);
    const element = this.template.querySelector(".rootcombobox");
    if (element) {
      element.classList.add("slds-is-open");
    }
    const element1 = this.template.querySelector(
      `[data-key="${this.items[0].name}"]`
    );
    if (element1) {
      this.descendant = element1?.id;
      this.template
        .querySelector(".inputtype")
        .setAttribute("aria-activedescendant", this.descendant);
    }
  }

  handlekeyup(event) {
    if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      const element = this.template.querySelector(".lookupelementfocus");
      if (element) {
        this.removeHighlight(element);
      }
      if (event.code === "ArrowUp") {
        this.selectedIndex--;
      } else {
        this.selectedIndex++;
      }
      if (this.selectedIndex > this.items.length - 1) {
        this.selectedIndex = 0;
      } else if (this.selectedIndex < 0) {
        this.selectedIndex = this.items.length - 1;
      }
      const nextElement = this.template.querySelector(
        `[data-key="${this.items[this.selectedIndex].name}"]`
      );
      if (nextElement) {
        this.hightlight(nextElement);
        this.descendant = nextElement.id;
        this.template
          .querySelector(".inputtype")
          .setAttribute("aria-activedescendant", nextElement.id);
      }
    } else if (event.code === "Enter") {
      this.closelistBox(this);
    }
  }

  handleMouseOver(event) {
    const element = this.template.querySelector(".lookupelementfocus");
    if (element) {
      this.removeHighlight(element);
    }
    this.hightlight(event.target);
    this.selectedIndex = event.target.dataset.index;
  }

  handleMouseOut(event) {
    this.removeHighlight(event.target);
  }

  removeHighlight(element) {
    element.classList.remove("slds-has-focus");
    element.classList.remove("lookupelementfocus");
  }

  hightlight(element) {
    element.classList.add("slds-has-focus");
    element.classList.add("lookupelementfocus");
    this.scrollIntoViewIfNeeded(
      element,
      this.template.querySelector(".mylookup")
    );
  }
  handleCloseList() {
    this.closelistBox(this);
  }

  handleListMouseDown() {
    this.allowClose = false;
  }

  handleListMouseUp() {
    this.allowClose = true;
    this.template.querySelector(".inputtype").focus();
  }

  closelistBox(that) {
    if (!this.allowClose) {
      return;
    }
    const element = that.template.querySelector(".rootcombobox");
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(() => {
      if (element) {
        element.classList.remove("slds-is-open");
      }
    });
  }

  scrollIntoViewIfNeeded(element, scrollingParent) {
    const parentRect = scrollingParent.getBoundingClientRect();
    const findMeRect = element.getBoundingClientRect();
    if (findMeRect.top < parentRect.top) {
      if (element.offsetTop + findMeRect.height < parentRect.height) {
        scrollingParent.scrollTop = 0;
      } else {
        scrollingParent.scrollTop = element.offsetTop;
      }
    } else if (findMeRect.bottom > parentRect.bottom) {
      scrollingParent.scrollTop += findMeRect.bottom - parentRect.bottom;
    }
  }
}
