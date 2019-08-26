interface Options {
  trigger?: string;
  duration?: number;
}

class LiteScroll {
  private options: Options;
  private requestFrame: number;
  private startTime: number;
  private startScrollY: number;
  private endScrollY: number;

  constructor(options: Options = {}) {
    this.options = {
      trigger: options.trigger ? options.trigger : '.litescroll-trigger',
      duration: options.duration ? options.duration : 1000
    };
    this.mountClickEvent();
  }

  private mountClickEvent() {
    const triggerElements = document.querySelectorAll(this.options.trigger);
    Array.from(triggerElements).forEach((el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        const scrollToEl = document.getElementById(el.getAttribute('href').replace('#', ''));
        this.startTime = new Date().getTime();
        this.startScrollY = window.scrollY;
        this.endScrollY = this.getOffset(scrollToEl).top - this.startScrollY;
        this.animate();
      });
    });
  }

  private animate() {
    const timeElapsed = new Date().getTime() - this.startTime;
    const isTimeOver = timeElapsed >= this.options.duration;
    const move = this.calcMoveAmount(timeElapsed);
    window.scrollTo(0, move);

    if (isTimeOver) {
      window.cancelAnimationFrame(this.requestFrame);
    } else {
      this.requestFrame = window.requestAnimationFrame(() => this.animate());
    }
  }

  private calcMoveAmount(timeElapsed) {
    let processingAmount = timeElapsed / this.options.duration > 1.0 ? 1.0 : timeElapsed / this.options.duration;
    return processingAmount * this.endScrollY + this.startScrollY;
  }

  private getOffset(el: HTMLElement) {
    const box = el.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
}

new LiteScroll();