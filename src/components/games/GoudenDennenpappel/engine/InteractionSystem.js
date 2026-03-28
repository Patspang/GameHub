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

    // Build flat mesh list with back-references to their entry
    const meshList = [];
    for (const entry of this.entries) {
      if (!entry.object3d.visible) continue;
      if (entry.object3d.isMesh) {
        meshList.push({ mesh: entry.object3d, entry });
      } else {
        entry.object3d.traverse((child) => {
          if (child.isMesh) meshList.push({ mesh: child, entry });
        });
      }
    }

    if (meshList.length === 0) {
      this.current = null;
      return null;
    }

    const hits = this.raycaster.intersectObjects(
      meshList.map((m) => m.mesh),
      false
    );

    if (hits.length > 0) {
      const found = meshList.find((m) => m.mesh === hits[0].object);
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
