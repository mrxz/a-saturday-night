import { EntityEvents } from "aframe";

AFRAME.registerComponent('proxy-event', {
  schema: {
    event: { default: '' },
    dst: { type: 'selector' },
    bubbles: { default: false }
  },

  init: function () {
    var dst = this.data.dst || this.el;
    this.el.sceneEl.addEventListener(this.data.event, (event) => {
      dst.emit(this.data.event as keyof EntityEvents, event, this.data.bubbles);
    });
  },

});
