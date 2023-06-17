import * as AFRAME from 'aframe';

const HighlighterComponent = AFRAME.registerComponent('highlighter', {
  schema: {
    color: {
      default: '#fff'
    },
    active: {
      default: false
    }
  },
  init: function () {
    var self = this;
    this.material = null;
    this.el.addEventListener('model-loaded', function () {
      var child = self.el.getObject3D('mesh').children[0].children[0]
      var mat = (child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>).material;
      mat.emissiveMap = mat.map;
      self.material = mat;
      // @ts-ignore
      self.update(null);
    });
  },
  update: function (oldData) {
    if (!this.material) return;
    if (oldData && this.data.color === oldData.color && this.active === oldData.active) return;
    this.material.emissive.set(this.data.active ? this.data.color : 0x000000);
  }
});

declare module "aframe" {
  export interface Components {
    "highlighter": InstanceType<typeof HighlighterComponent>;
  }
}