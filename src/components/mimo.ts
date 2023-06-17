import { Entity } from 'aframe';
import { strict } from 'aframe-typescript';

/* globals AFRAME THREE */
const MimoComponent = AFRAME.registerComponent('mimo', strict<{
  mirroredEl: Entity|null
}>().component({
  schema: {type: 'selector'},

  update: function () {
    if (this.data === this.mirroredEl) { return; }
    this.mirroredEl = this.data;
  },

  tick: function () {
    var el = this.el;
    var mirroredEl = this.mirroredEl;
    var position;
    var rotation;
    if(!mirroredEl) { return; }
    position = mirroredEl.getAttribute('position');
    rotation = mirroredEl.getAttribute('rotation');
    el.setAttribute('position', {
      x: -position.x,
      y: position.y,
      z: position.z
    });
    el.setAttribute('rotation', {
      x: rotation.x,
      y: -rotation.y,
      z: -rotation.z
    });
  }
}));

declare module "aframe" {
  export interface Components {
    "mimo": InstanceType<typeof MimoComponent>
  }
}
