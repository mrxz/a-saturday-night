/* global AFRAME, THREE */

AFRAME.registerComponent('roomcolor', {
  schema: {
    default: 1.0
  },
  init : function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update : function (oldData) {
    if (oldData == this.data) return;
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    mesh.children[0].children[0].material.emissiveIntensity = this.data;
  }
})