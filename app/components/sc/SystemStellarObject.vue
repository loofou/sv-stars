<script lang="ts" setup>
import { Vector3, Texture } from 'three';
import SpriteText from 'three-spritetext';
import { earthMassesToKg, solarMassesToKg, calcOrbitInTime } from '~/utils/physics';
import type { Satellite } from '~/utils/types';
import { StarRadiusMultiplierInSystemView, PlanetDotScale } from '~/utils/utils';
import { StellarTypes } from '~/utils/types';
import type { ShallowRef } from 'vue';

const { seekByName } = useSeek();
const { scene } = useTresContext();

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
const parentPosition = ref(new Vector3(0, 0, 0));
if (props.stellarObject.hasParent) {
  const parent = props.stellarObject.getParent(props.system);
  if (!parent) {
    console.error('Parent not found for', props.stellarObject.name, props.stellarObject.parent);
  } else {
    let parentMass = 0;

    const parentSceneObject = seekByName(scene.value, parent.name);
    parentPosition.value = parentSceneObject?.position ?? new Vector3(0, 0, 0);

    if (parent.type == StellarTypes.STAR) {
      parentMass = solarMassesToKg(parent.mass);
    } else if (parent.type == StellarTypes.PLANET) {
      parentMass = earthMassesToKg(parent.mass);
    }

    position.value = calcOrbitInTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
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

//create label
const labelColor = ref('white');
//if (props.selected) labelColor.value = 'green';

const label = shallowRef(new SpriteText(props.stellarObject.name, 0.015));
label.value.name = 'label';
label.value.color = labelColor.value;
label.value.strokeColor = 'black';
label.value.strokeWidth = 1;
label.value.material.sizeAttenuation = false;
label.value.translateY(2);

watch(
  () => time.value.currentTime,
  () => {
    if (props.stellarObject.hasParent) {
      const parent = props.stellarObject.getParent(props.system);
      if (!parent) return;

      let parentMass = 0;

      const parentSceneObject = seekByName(scene.value, parent.name);
      parentPosition.value = parentSceneObject?.position ?? new Vector3(0, 0, 0);

      if (parent.type == StellarTypes.STAR) {
        parentMass = solarMassesToKg(parent.mass);
      } else if (parent.type == StellarTypes.PLANET) {
        parentMass = earthMassesToKg(parent.mass);
      }

      position.value = calcOrbitInTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
    }
  },
);

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
        v-if="stellarObject.type != StellarTypes.STAR"
        :name="stellarObject.name + '-mesh'"
        :scale="PlanetDotScale"
        @click="emit('click')"
        @double-click="doubleClick()"
      >
        <TresSpriteMaterial
          :map="texture.map"
          :color="(stellarObject as Satellite).uiColor"
          :size-attenuation="false"
        />
      </TresSprite>

      <primitive :object="label" />
    </TresGroup>
    <ScSystemStellarObjectEllipse v-if="stellarObject.hasParent" :stellar-object="stellarObject" :system="system" />
  </TresGroup>
</template>
