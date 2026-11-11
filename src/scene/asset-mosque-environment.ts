import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// CC0 environment pack: Desert Mosque and Madrasa Courtyard.
// 174k triangles, approximately 4.1 MB; GLB is web-optimised and needs no extra decoder.
const ENVIRONMENT_URL = 'https://cdn.3dassets.dev/assets/38153/v1/model.glb';

export async function loadAssetMosqueEnvironment(scene: THREE.Scene): Promise<boolean> {
  try {
    const gltf = await new GLTFLoader().loadAsync(ENVIRONMENT_URL);
    const environment = gltf.scene;
    environment.name = 'noor-cc0-mosque-courtyard-preview';
    environment.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    });
    scene.add(environment);
    return true;
  } catch (error) {
    console.error('Noor mosque environment preview failed to load', error);
    return false;
  }
}
