AFRAME.registerComponent('collect-url', {
  init: function () {
    document.getElementById('floor').setAttribute('discofloor', {pattern: 'idle'});
    var el = this.el;
    var textElement = this.textElement = document.getElementById('collectText');
    var selectedAvatarEl = this.el.getAttribute('game-state').selectedAvatar;
    this.soundEl = document.querySelector('#room [sound]');
    textElement.setAttribute('visible', true);

    [...textElement.children].forEach(childTextElement => {
      childTextElement.setAttribute('animation', {
        property: 'text.opacity',
        to: 1.0,
        dur: 1000,
      });
      childTextElement.addEventListener('animationcomplete', function onAnimationComplete() {
        childTextElement.removeAttribute('animation');
        childTextElement.removeEventListener('animatoincomplete', onAnimationComplete);
      });
    })

    var json = {
      avatar: selectedAvatarEl.id,
      recording: this.el.components['avatar-recorder'].getJSONData()
    }
    // @fixme Hack to fix serialization errors on events
    delete json.recording['leftSelectionHand'];
    delete json.recording['rightSelectionHand'];
    if (json.recording.rightHand) { json.recording.rightHand.events = []; }
    if (json.recording.leftHand) { json.recording.leftHand.events = []; }
    el.systems['uploadcare'].upload(json, 'application/json');
    this.soundEl.components.sound.playSound();
    el.setAttribute('game-state', 'state', 'replay');
    el.components['replay'].loadDance(json);
    // Analytics. We want to count the global number of recorded dances.
    ga('send', 'event', 'a-saturday-night', 'dancerecorded');
  },

  remove: function () {
    this.textElement.setAttribute('visible', false);
    this.soundEl.components.sound.stopSound();
  }
});
