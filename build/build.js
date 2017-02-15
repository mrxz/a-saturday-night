!function(t){function e(n){if(i[n])return i[n].exports;var o=i[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var i={};return e.m=t,e.c=i,e.p="",e(0)}([function(t,e,i){i(1),i(2),i(3),i(4),i(5),i(6),i(7),i(8),i(9),i(10)},function(t,e){AFRAME.registerShader("skyGradient",{schema:{colorTop:{type:"color",default:"black",is:"uniform"},colorBottom:{type:"color",default:"red",is:"uniform"}},vertexShader:["varying vec3 vWorldPosition;","void main() {","vec4 worldPosition = modelMatrix * vec4( position, 1.0 );","vWorldPosition = worldPosition.xyz;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["uniform vec3 colorTop;","uniform vec3 colorBottom;","varying vec3 vWorldPosition;","void main()","{","vec3 pointOnSphere = normalize(vWorldPosition.xyz);","float f = 1.0;","if(pointOnSphere.y > - 0.2){","f = sin(pointOnSphere.y * 2.0);","}","gl_FragColor = vec4(mix(colorBottom,colorTop, f ), 1.0);","}"].join("\n")})},function(t,e){AFRAME.registerComponent("aabb-collider",{schema:{objects:{default:""},state:{default:"collided"}},init:function(){this.els=[],this.collisions=[],this.elMax=new THREE.Vector3,this.elMin=new THREE.Vector3},update:function(){var t,e=this.data;t=e.objects?this.el.sceneEl.querySelectorAll(e.objects):this.el.sceneEl.children,this.els=Array.prototype.slice.call(t)},tick:function(){var t=new THREE.Box3;return function(){function e(e){var i,n,s,a=e.getObject3D("mesh");a&&(t.setFromObject(a),n=t.min,s=t.max,i=r.elMin.x<=s.x&&r.elMax.x>=n.x&&r.elMin.y<=s.y&&r.elMax.y>=n.y&&r.elMin.z<=s.z&&r.elMax.z>=n.z,i&&o.push(e))}function i(t){t.emit("hit"),t.addState(r.data.state),r.el.emit("hit",{el:t})}function n(){t.setFromObject(a),r.elMin.copy(t.min),r.elMax.copy(t.max)}var o=[],s=this.el,a=s.getObject3D("mesh"),r=this;a&&(n(),this.els.forEach(e),o.forEach(i),0===o.length&&r.el.emit("hit",{el:null}),this.collisions.filter(function(t){return o.indexOf(t)===-1}).forEach(function(t){t.removeState(r.data.state)}),this.collisions=o)}}()})},function(t,e){AFRAME.registerComponent("game-state",{schema:{selectedAvatar:{type:"selector"},countdownTime:{default:3},dancingTime:{default:3},state:{default:"avatar-selection",oneOf:["avatar-selection","countdown","dancing","collect-url"]}},update:function(t){var e=this.data,i=(e.state,this.el);if(t.state!==e.state)return void this.setState(e.state);switch(e.state){case"avatar-selection":if(!e.selectedAvatar)return;i.setAttribute("game-state","state","countdown");break;case"countdown":if(e.countdownTime>0)return;i.setAttribute("game-state","state","dancing");break;case"dancing":if(e.dancingTime>0)return;i.setAttribute("game-state","state","collect-url");break;case"collect-url":break;default:console.log("Unknown state "+e.state)}},setState:function(t){var e=this.el,i=this.schema.state.oneOf;this.updatingState||(i.indexOf(t)===-1&&console.log("Unknown state: "+t),i.forEach(function(t){e.removeAttribute(t)}),e.setAttribute(t,""))}})},function(t,e){AFRAME.registerComponent("grab",{init:function(){this.GRABBED_STATE="grabbed",this.onHit=this.onHit.bind(this),this.onGripOpen=this.onGripOpen.bind(this),this.onGripClose=this.onGripClose.bind(this)},play:function(){var t=this.el;t.addEventListener("hit",this.onHit),t.addEventListener("gripclose",this.onGripClose),t.addEventListener("gripopen",this.onGripOpen),t.addEventListener("thumbup",this.onGripClose),t.addEventListener("thumbdown",this.onGripOpen),t.addEventListener("pointup",this.onGripClose),t.addEventListener("pointdown",this.onGripOpen)},pause:function(){var t=this.el;t.removeEventListener("hit",this.onHit),t.removeEventListener("gripclose",this.onGripClose),t.removeEventListener("gripopen",this.onGripOpen),t.removeEventListener("thumbup",this.onGripClose),t.removeEventListener("thumbdown",this.onGripOpen),t.removeEventListener("pointup",this.onGripClose),t.removeEventListener("pointdown",this.onGripOpen)},onGripClose:function(t){this.grabbing=!0,delete this.previousPosition},onGripOpen:function(t){var e=this.hitEl;this.grabbing=!1,e&&(e.removeState(this.GRABBED_STATE),this.hitEl=void 0)},onHit:function(t){var e=t.detail.el;e&&!e.is(this.GRABBED_STATE)&&this.grabbing&&!this.hitEl&&(e.addState(this.GRABBED_STATE),this.hitEl=e)},tick:function(){var t,e=this.hitEl;e&&(this.updateDelta(),t=e.getAttribute("position"),e.setAttribute("position",{x:t.x+this.deltaPosition.x,y:t.y+this.deltaPosition.y,z:t.z+this.deltaPosition.z}))},updateDelta:function(){var t=this.el.getAttribute("position"),e=this.previousPosition||t,i={x:t.x-e.x,y:t.y-e.y,z:t.z-e.z};this.previousPosition=t,this.deltaPosition=i}})},function(t,e){AFRAME.registerComponent("ground",{init:function(){var t,e=this.el.object3D,i="https://cdn.aframe.io/link-traversal/models/ground.json";this.objectLoader||(t=this.objectLoader=new THREE.ObjectLoader,t.crossOrigin="",t.load(i,function(t){t.children.forEach(function(t){t.receiveShadow=!0,t.material.shading=THREE.FlatShading}),e.add(t)}))}})},function(t,e){AFRAME.registerComponent("discofloor",{schema:{bpm:{default:240}},init:function(){this.tiles=[],this.myTick=null,this.tickTime=500,this.step=0,this.el.addEventListener("model-loaded",this.initTiles.bind(this))},initTiles:function(t){for(var e=0;e<t.detail.model.children.length;e++)this.tiles[e]=t.detail.model.children[e]},update:function(t){this.tickTime=6e4/this.data.bpm},tick:function(t,e){null===this.myTick&&(this.myTick=t),t-this.myTick>this.tickTime&&(this.myTick=t,this.step++,this.animTick())},animTick:function(){for(var t=this.tiles.length,e=3.5,i=this.step%20,n=0;n<t;n++){var o=Math.floor(n%8),s=Math.floor(n/8),a=o-e,r=s-e,l=a*a+r*r;this.tiles[n].visible=Math.abs(l-i)<3}}})},function(t,e){AFRAME.registerComponent("avatar-selection",{init:function(){var t=this.avatarSelectionEl=this.el.querySelector("#avatarSelection");this.avatarEls=this.el.querySelectorAll(".avatar"),this.selectAvatar(0),t.setAttribute("visible",!0),this.onKeyDown=this.onKeyDown.bind(this),this.pauseCamera=this.pauseCamera.bind(this),window.addEventListener("keydown",this.onKeyDown),this.el.sceneEl.camera&&this.pauseCamera({detail:{cameraEl:this.el.sceneEl.camera.el}}),this.el.sceneEl.addEventListener("camera-set-active",this.pauseCamera)},pauseCamera:function(t){var e=this.cameraEl=t.detail.cameraEl||t.detail.target;e.pause(),this.el.addEventListener("loaded",function(){e.pause()}),e.addEventListener("loaded",function(){e.pause()})},onKeyDown:function(t){var e=this.el.querySelector("#avatarHead"),i=t.keyCode;if(37===i||39===i||13===i)switch(i){case 37:this.selectPreviousAvatar();break;case 39:this.selectNextAvatar();break;case 13:this.el.setAttribute("game-state","selectedAvatar",this.selectedAvatarEl),e.setAttribute("obj-model",{obj:this.selectedAvatarEl.getAttribute("src"),mtl:this.selectedAvatarEl.getAttribute("mtl")})}},selectPreviousAvatar:function(){this.avatarIndex<=0||this.selectAvatar(this.avatarIndex-1)},selectNextAvatar:function(){this.avatarIndex!==this.avatarEls.length-1&&this.selectAvatar(this.avatarIndex+1)},pause:function(){window.removeEventListener("keydown",this.onKeyDown)},selectAvatar:function(t){var e,i=this.avatarEls;t<0||t>=i.length||(this.avatarIndex=t,e=this.avatarEls[t],e.setAttribute("scale","1.5 1.5 1.5"),this.selectedAvatarEl&&this.selectedAvatarEl.setAttribute("scale","1 1 1"),this.selectedAvatarEl=e)},remove:function(){this.avatarSelectionEl.setAttribute("visible",!1),this.cameraEl.play(),this.el.sceneEl.removeEventListener("camera-set-active",this.pauseCamera),this.cameraEl.removeEventListener("loaded",this.pauseCamera),window.removeEventListener("keydown",this.onKeyDown)}})},function(t,e){AFRAME.registerComponent("collect-url",{init:function(){var t=this.urlEl=document.createElement("div");t.style.position="absolute",t.style.width="800px",t.style.top="50%",t.style.left="calc(50% - 400px)",t.style.fontSize="80px",t.style.fontWeight="bold",t.style.color="white",t.innerHTML="Copy your dance URL",document.body.appendChild(t)},remove:function(){document.body.removeChild(this.urlEl)}})},function(t,e){AFRAME.registerComponent("countdown",{init:function(){var t=this.countdownEl=document.createElement("div");this.countdownTime=this.el.getAttribute("game-state").countdownTime,this.countdown=this.countdown.bind(this),t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.fontSize="120px",t.style.fontWeight="bold",t.style.color="white",t.innerHTML=this.countdownTime,this.interval=window.setInterval(this.countdown,1e3),document.body.appendChild(t)},remove:function(){document.body.removeChild(this.countdownEl)},countdown:function(){this.countdownTime--,this.countdownEl.innerHTML=this.countdownTime,this.el.setAttribute("game-state","countdownTime",this.countdownTime),0===this.countdownTime&&window.clearInterval(this.interval)}})},function(t,e){AFRAME.registerComponent("dancing",{init:function(){var t=this.countdownEl=document.createElement("div");this.dancingTime=this.el.getAttribute("game-state").dancingTime,this.countdown=this.countdown.bind(this),t.style.textAlign="center",t.style.position="absolute",t.style.width="400px",t.style.top="50%",t.style.left="calc(50% - 200px)",t.style.fontSize="120px",t.style.fontWeight="bold",t.style.color="white",t.innerHTML="Dance!</br>"+this.dancingTime,this.el.components["avatar-recorder"].startRecording(),this.interval=window.setInterval(this.countdown,1e3),document.body.appendChild(t)},countdown:function(){this.dancingTime--,this.countdownEl.innerHTML="Dance!</br>"+this.dancingTime,this.el.setAttribute("game-state","dancingTime",this.dancingTime),0===this.dancingTime&&(window.clearInterval(this.interval),this.el.components["avatar-recorder"].stopRecording())},remove:function(){document.body.removeChild(this.countdownEl)}})}]);