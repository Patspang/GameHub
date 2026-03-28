// First-person movement controller
// Reads joystick (x,y: -1 to 1) and look deltas, moves camera with collision detection

import * as THREE from 'three';

export class FirstPersonController {
  constructor(camera) {
    this.camera = camera;
    this.yaw = 0;   // Y rotation (left/right)
    this.pitch = 0; // X rotation (up/down, limited)
    this.speed = 5; // units per second
    this.playerRadius = 0.4;
    this.currentSpeed = 0; // 0–1, updated every frame

    // Input state (set from touch handler)
    this.joystick = { x: 0, y: 0 };
    this.lookDelta = { x: 0, y: 0 };

    // Collision geometry
    this.collisionCircles = []; // { x, z, r }
    this.collisionBoxes = [];   // { minX, maxX, minZ, maxZ }

    // Reusable objects to avoid per-frame allocations
    this._euler  = new THREE.Euler(0, 0, 0, 'YXZ');
    this._forward = new THREE.Vector3();
    this._right   = new THREE.Vector3();
    this._move    = new THREE.Vector3();
  }

  addCollisionCircle(x, z, r) {
    this.collisionCircles.push({ x, z, r });
  }

  addCollisionBox(minX, maxX, minZ, maxZ) {
    this.collisionBoxes.push({ minX, maxX, minZ, maxZ });
    return this.collisionBoxes.length - 1; // return index for later removal
  }

  removeCollisionBox(index) {
    if (index >= 0 && index < this.collisionBoxes.length) {
      this.collisionBoxes.splice(index, 1);
    }
  }

  setJoystick(x, y) {
    this.joystick = { x, y };
  }

  addLookDelta(dx, dy) {
    this.lookDelta.x += dx;
    this.lookDelta.y += dy;
  }

  update(delta) {
    // Apply look rotation
    const lookSens = 0.003;
    this.yaw -= this.lookDelta.x * lookSens;
    this.pitch -= this.lookDelta.y * lookSens;
    this.pitch = Math.max(-Math.PI / 5, Math.min(Math.PI / 5, this.pitch));
    this.lookDelta = { x: 0, y: 0 };

    // Reuse pre-allocated Euler — no garbage
    this._euler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(this._euler);

    // Calculate movement
    const { x: jx, y: jy } = this.joystick;
    // Track joystick magnitude (0 = still, 1 = full speed)
    this.currentSpeed = Math.min(1, Math.sqrt(jx * jx + jy * jy));
    if (jx === 0 && jy === 0) return;

    // Forward/right vectors projected to ground plane — reuse pre-allocated
    this._forward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this._right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    // jy < 0 means joystick pushed up (forward)
    this._move.copy(this._forward).multiplyScalar(-jy);
    this._move.addScaledVector(this._right, jx);

    if (this._move.length() > 0) {
      this._move.normalize().multiplyScalar(this.speed * delta);
    }

    const newX = this.camera.position.x + this._move.x;
    const newZ = this.camera.position.z + this._move.z;
    const r = this.playerRadius;

    // Check collision circles (trees) — use squared distance to avoid sqrt
    for (const c of this.collisionCircles) {
      const dx = newX - c.x;
      const dz = newZ - c.z;
      const minDist = c.r + r;
      if (dx * dx + dz * dz < minDist * minDist) {
        c.onHit?.(newX - c.x);
        return;
      }
    }

    // Check collision boxes (log, walls)
    for (const b of this.collisionBoxes) {
      if (
        newX > b.minX - r && newX < b.maxX + r &&
        newZ > b.minZ - r && newZ < b.maxZ + r
      ) return;
    }

    this.camera.position.x = newX;
    this.camera.position.z = newZ;
    this.camera.position.y = 1.7; // keep upright
  }
}
