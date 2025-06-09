<script lang="ts" setup>
import { Vector3, Texture, PerspectiveCamera } from 'three';
import SpriteText from 'three-spritetext';
import { earthMassesToKg, solarMassesToKg, calcOrbitInTime } from '~/utils/physics';
import type { Satellite } from '~/utils/types';
import { StarRadiusMultiplierInSystemView, PlanetDotScale, StarUtils } from '~/utils/utils';
import { StellarTypes } from '~/utils/types';
import type { ShallowRef } from 'vue';

const { seekByName } = useSeek();
const { scene, camera, renderer } = useTresContext();

const emit = defineEmits<{
  click: [];
  'double-click': [object: ShallowRef];
}>();

const props = defineProps({
  stellarObject: {
    type: StellarObject,
    required: true,
  },
  system: {
    type: System,
    required: true,
  },
});

const settings = useSettings();
const time = useStarTime();

const root = shallowRef();

//orbit
const position = ref(new Vector3(0, 0, 0));
const parentPosition: Ref<[x: number, y: number, z: number]> = ref([0, 0, 0]);

if (props.stellarObject.hasParent) {
  const parent = props.stellarObject.getParent(props.system);
  if (!parent) {
    console.error('Parent not found for', props.stellarObject.name, props.stellarObject.parent);
  } else {
    adjustPosition(parent);
  }
}

//load texture if planet
let texture: {
  map: Texture;
};
if (props.stellarObject.type === StellarTypes.PLANET) {
  texture = await useTexture({ map: 'textures/disc.png' });
}
if (props.stellarObject.type === StellarTypes.MOON) {
  texture = await useTexture({ map: 'textures/crescent.png' });
} else {
  await new Promise((r) => setTimeout(r, 100)); // tiny hack around Suspense requiring an async component
}

const spriteVisible = ref(true);

//create label
const labelColor = ref('white');
const labelVisible = ref(true);
//if (props.selected) labelColor.value = 'green';

const label = shallowRef(new SpriteText(props.stellarObject.name, 0.015));
label.value.name = 'label';
label.value.color = labelColor.value;
label.value.strokeColor = 'black';
label.value.strokeWidth = 1;
label.value.material.sizeAttenuation = false;
label.value.material.depthTest = false;
label.value.material.depthWrite = false;
label.value.renderOrder = 100;
updateLabelPosition();

watch(
  () => time.value.currentTime,
  () => {
    if (props.stellarObject.hasParent) {
      const parent = props.stellarObject.getParent(props.system);
      if (!parent) return;

      adjustPosition(parent);
    }

    updateLabelPosition();
  },
);

function adjustPosition(parent: StellarObject) {
  const parentSceneObject = seekByName(scene.value, parent.name);
  parentPosition.value = StarUtils.convertToNum3(parentSceneObject?.position ?? new Vector3(0, 0, 0));

  let parentMass = 0;
  if (parent.type == StellarTypes.STAR) {
    parentMass = solarMassesToKg(parent.mass);
  } else if (parent.type == StellarTypes.PLANET) {
    parentMass = earthMassesToKg(parent.mass);
  }

  position.value = calcOrbitInTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
}

function updateLabelPosition() {
  if (!camera.value || !renderer.value || !root.value) return;

  const objectWorldPos = new Vector3();
  root.value.getWorldPosition(objectWorldPos);

  const perspectiveCamera = camera.value as PerspectiveCamera;
  const cameraPos = perspectiveCamera.position;
  const distance = objectWorldPos.distanceTo(cameraPos);

  const fov = perspectiveCamera.fov * (Math.PI / 180); // radians
  const height = renderer.value.domElement.height;

  // World units per pixel at this distance
  const worldPerPixel = (2 * Math.tan(fov / 2) * distance) / height;
  const offsetWorld = worldPerPixel * 32;
  label.value.position.set(0, offsetWorld, 0);

  // Disable label for moons if too far
  if (props.stellarObject.type === StellarTypes.MOON) {
    const maxLabelDistance = 20;
    const maxSpriteDistance = maxLabelDistance * 4;
    labelVisible.value = distance <= maxLabelDistance;
    spriteVisible.value = distance <= maxSpriteDistance;
    label.value.visible = labelVisible.value;
  } else {
    label.value.visible = true;
  }
}

const doubleClick = () => {
  if (root.value) {
    emit('double-click', root);
  }
};
</script>

<template>
  <TresGroup :name="stellarObject.name + '-root'" :position="parentPosition">
    <TresGroup ref="root" :name="stellarObject.name" :position>
      <!--Star-->
      <TresMesh
        v-if="stellarObject.type == StellarTypes.STAR"
        :name="stellarObject.name + '-mesh'"
        @click="emit('click')"
        @double-click="doubleClick()"
      >
        <TresSphereGeometry
          :args="[Math.max(0.05, ((stellarObject as Star).radius ?? 1) * StarRadiusMultiplierInSystemView), 32, 16]"
        />
        <TresMeshStandardMaterial
          :color="(stellarObject as Star).color"
          :emissive="(stellarObject as Star).color"
          :emissive-intensity="settings.showBloom ? 3 : 1"
        />
      </TresMesh>
      <!--Satellite-->
      <TresSprite
        v-if="stellarObject.type != StellarTypes.STAR && spriteVisible"
        :name="stellarObject.name + '-mesh'"
        :scale="PlanetDotScale"
        @click="emit('click')"
        @double-click="doubleClick()"
      >
        <TresSpriteMaterial
          :map="texture.map"
          :color="(stellarObject as Satellite).uiColor"
          :size-attenuation="false"
          :depth-test="false"
        />
      </TresSprite>

      <primitive :object="label" />
    </TresGroup>
    <ScSystemStellarObjectEllipse v-if="stellarObject.hasParent" :stellar-object="stellarObject" :system="system" />
  </TresGroup>
</template>
