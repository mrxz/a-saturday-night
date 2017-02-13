AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    this.avatarEls = this.el.querySelectorAll('.avatar');
    this.selectAvatar(0);
    avatarSelectionEl.setAttribute('visible', true);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.pauseCamera = this.pauseCamera.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
    if (this.el.sceneEl.camera) {
      this.pauseCamera({detail: {cameraEl: this.el.sceneEl.camera.el}});
    }
    this.el.sceneEl.addEventListener('camera-set-active', this.pauseCamera);
  },

  pauseCamera: function (evt) {
    var cameraEl = this.cameraEl = evt.detail.cameraEl || evt.detail.target;
    cameraEl.pause();
    this.el.addEventListener('loaded', function() {
      cameraEl.pause();
    });
    cameraEl.addEventListener('loaded', function () {
      cameraEl.pause();
    });
  },

  onKeyDown: function (event) {
    var avatarHeadEl = this.el.querySelector('#avatarHead');
    var code = event.keyCode;
    if (code !== 37 && code !== 39 && code !== 13) { return; }
    switch (code) {
      case 37: {
        this.selectPreviousAvatar();
        break;
      }
      case 39 : {
        this.selectNextAvatar();
        break;
      }
      case 13: {
        this.el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);
        avatarHeadEl.setAttribute('obj-model', {
          obj: this.selectedAvatarEl.getAttribute('src'),
          mtl: this.selectedAvatarEl.getAttribute('mtl')
        });
        break;
      }
    }
  },

  selectPreviousAvatar: function () {
    if (this.avatarIndex <= 0) { return; }
    this.selectAvatar(this.avatarIndex-1);
  },

  selectNextAvatar: function () {
    if (this.avatarIndex === this.avatarEls.length - 1) { return; }
    this.selectAvatar(this.avatarIndex+1);
  },

  pause: function () {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  selectAvatar: function (index) {
    var avatarEls = this.avatarEls;
    var avatarEl;
    if (index < 0 || index >= avatarEls.length) { return; }
    this.avatarIndex = index;
    avatarEl = this.avatarEls[index];
    avatarEl.setAttribute('scale', '1.5 1.5 1.5');
    if (this.selectedAvatarEl) { this.selectedAvatarEl.setAttribute('scale', '1 1 1'); }
    this.selectedAvatarEl = avatarEl;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
    this.cameraEl.play();
    this.el.sceneEl.removeEventListener('camera-set-active', this.pauseCamera);
    this.cameraEl.removeEventListener('loaded', this.pauseCamera);
    window.removeEventListener('keydown', this.onKeyDown);
  }
});
