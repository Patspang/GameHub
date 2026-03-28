// Interaction system — raycasts from camera center to detect nearby interactable objects
// Supports both Mesh and Group objects as interactables

import * as THREE from 'three';

export class InteractionSystem {
  constructor(camera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 3.5; // max interaction distance
    this.origin = new THREE.Vector2(0, 0); // screen center
    this.entries = []; // { object3d, callback, label }
    this.current = null;

    // Reusable state to avoid per-frame closure allocations
    this._meshList = [];
    this._currentEntry = null;
    this._traverseFn = (child) => {
      if (child.isMesh) this._meshList.push({ mesh: child, entry: this._currentEntry });
    };
  }

  // Register an interactable object (Mesh or Group)
  add(object3d, callback, label) {
    this.entries.push({ object3d, callback, label });
  }

  // Unregister an interactable
  remove(object3d) {
    this.entries = this.entries.filter((e) => e.object3d !== object3d);
    if (this.current?.object3d === object3d) {
      this.current = null;
    }
  }

  // Call this every frame — returns the nearest interactable if any
  update() {
    if (this.entries.length === 0) {
      this.current = null;
      return null;
    }

    this.raycaster.setFromCamera(this.origin, this.camera);

    // Reuse pre-allocated array — no per-frame garbage
    this._meshList.length = 0;
    for (const entry of this.entries) {
      if (!entry.object3d.visible) continue;
      if (entry.object3d.isMesh) {
        this._meshList.push({ mesh: entry.object3d, entry });
      } else {
        this._currentEntry = entry;
        entry.object3d.traverse(this._traverseFn);
      }
    }

    if (this._meshList.length === 0) {
      this.current = null;
      return null;
    }

    const hits = this.raycaster.intersectObjects(
      this._meshList.map((m) => m.mesh),
      false
    );

    if (hits.length > 0) {
      const found = this._meshList.find((m) => m.mesh === hits[0].object);
      this.current = found?.entry ?? null;
    } else {
      this.current = null;
    }

    return this.current;
  }

  // Trigger the current interactable
  interact() {
    this.current?.callback();
  }
}
