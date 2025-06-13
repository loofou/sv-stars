<script lang="ts" setup>
import { Vector3, Texture, PerspectiveCamera, DoubleSide, Euler } from 'three';
import SpriteText from 'three-spritetext';
import {
  earthMassesToKg,
  solarMassesToKg,
  calcOrbitInTime,
  metersToAstronomicalUnits,
  degToRad,
} from '~/utils/physics';
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
  selected: {
    type: Boolean,
    default: false,
  },
  distance01: {
    type: Boolean,
    default: false,
  },
  distance02: {
    type: Boolean,
    default: false,
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
} else if (props.stellarObject.type === StellarTypes.MOON) {
  texture = await useTexture({ map: 'textures/crescent.png' });
} else if (props.stellarObject.type === StellarTypes.ASTEROID) {
  texture = await useTexture({ map: 'textures/diamond.png' });
} else if (props.stellarObject.type === StellarTypes.DWARF_PLANET) {
  texture = await useTexture({ map: 'textures/donut.png' });
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
updateObjectUI();

watch(
  () => time.value.currentTime,
  () => {
    if (props.stellarObject.hasParent) {
      const parent = props.stellarObject.getParent(props.system);
      if (!parent) return;

      adjustPosition(parent);
    }

    updateObjectUI();
  },
);

function adjustPosition(parent: StellarObject) {
  const parentSceneObject = seekByName(scene.value, parent.name);
  parentPosition.value = StarUtils.convertToNum3(parentSceneObject?.position ?? new Vector3(0, 0, 0));

  const parentMass =
    parent?.type == StellarTypes.STAR ? solarMassesToKg(parent.mass) : earthMassesToKg(parent?.mass ?? 0);
  position.value = calcOrbitInTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
}

function updateObjectUI() {
  if (!camera.value || !renderer.value || !root.value) return;

  if (props.selected) labelColor.value = 'green';
  else if (props.distance01) labelColor.value = 'yellow';
  else if (props.distance02) labelColor.value = 'orange';
  else labelColor.value = 'white';
  label.value.color = labelColor.value;

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

const ringRotation = computed(() => {
  const orbit = props.stellarObject.orbit;
  if (!orbit) return new Euler(0, 0, 0);

  const i = degToRad(orbit.inclination ?? 0);
  const Ω = degToRad(orbit.longitudeOfAscendingNode ?? 0);
  const ω = degToRad(orbit.argumentOfPeriapsis ?? 0);

  // Euler order: Z (Ω), X (i), Z (ω)
  // Three.js Euler only supports certain orders, so we combine Z rotations
  return new Euler(Math.PI / 2 + i, 0, Ω + ω, 'XZY');
});
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

      <!--Rings-->
      <TresMesh
        v-if="stellarObject.type != StellarTypes.STAR && spriteVisible && (stellarObject as Satellite).hasRings"
        v-for="(ring, i) in (stellarObject as Satellite).rings"
        :name="stellarObject.name + '-ring-' + i"
        :rotation="ringRotation"
      >
        <TresRingGeometry
          :args="[
            metersToAstronomicalUnits(ring.innerRadius) * AUMultiplier,
            metersToAstronomicalUnits(ring.outerRadius) * AUMultiplier,
            64,
          ]"
        />
        <TresMeshStandardMaterial
          :color="ring.color"
          :emissive="ring.color"
          :emissive-intensity="1"
          :side="DoubleSide"
          :transparent="true"
          :opacity="0.5"
        />
      </TresMesh>

      <primitive :object="label" />
    </TresGroup>
    <ScSystemStellarObjectEllipse v-if="stellarObject.hasParent" :stellar-object="stellarObject" :system="system" />
  </TresGroup>
</template>
