/* global AFRAME, THREE */

AFRAME.registerComponent('roomcolor', {
  schema: {
    default: 1.0
  },
  init : function () {
    // @ts-ignore
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update : function (oldData) {
    if (oldData == this.data) return;
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    const child = mesh.children[0].children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    child.material.emissiveIntensity = this.data;
  }
})