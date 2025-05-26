<script lang="ts" setup>
import { Vector3, Texture } from 'three';
import SpriteText from 'three-spritetext';
import { adjustForTime, earthMassesToKg, solarMassesToKg, calcOrbitInTime } from '~/utils/physics';
import type { Planet } from '~/utils/types';
import { AUMultiplier, StarRadiusMultiplierInSystemView, PlanetDotScale } from '~/utils/utils';

const emit = defineEmits(['click']);

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

//orbit
const position = ref(new Vector3(0, 0, 0));
if (props.stellarObject.parent) {
  const parent = props.stellarObject.getParent(props.system);
  if (!parent) {
    console.error('Parent not found for', props.stellarObject.name, props.stellarObject.parent);
  } else {
    let parentMass = 0;

    if (parent && parent.type == 'Star') {
      parentMass = solarMassesToKg(parent.mass);
    } else if (parent && parent.type == 'Planet') {
      parentMass = earthMassesToKg(parent.mass);
    }
    position.value = calcOrbitInTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
  }
}

//load texture if planet
let texture: {
  map: Texture;
};
if (props.stellarObject.type != 'Star') {
  texture = await useTexture({ map: 'textures/disc.png' });
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
    if (props.stellarObject.parent) {
      const parent = props.stellarObject.getParent(props.system);
      let parentMass = 0;

      if (parent && parent.type == 'Star') {
        parentMass = solarMassesToKg(parent.mass);
      } else if (parent && parent.type == 'Planet') {
        parentMass = earthMassesToKg(parent.mass);
      } else {
        console.error('Parent not found for', props.stellarObject.name, props.stellarObject.parent);
      }

      const adjustedOrbit = adjustForTime(props.stellarObject.orbit, parentMass, time.value.currentTime);
      const { position: pos } = keplerianToCartesian(adjustedOrbit, parentMass * G);
      position.value = pos;
      position.value.multiplyScalar(AUMultiplier);
    }
  },
);
</script>

<template>
  <TresGroup :name="stellarObject.name">
    <TresGroup :position>
      <!--Star-->
      <TresMesh v-if="stellarObject.type == 'Star'" :name="stellarObject.name" @click="emit('click')">
        <TresSphereGeometry
          :args="[Math.max(0.05, ((stellarObject as Star).radius ?? 1) * StarRadiusMultiplierInSystemView), 32, 16]"
        />
        <TresMeshStandardMaterial
          :color="(stellarObject as Star).color"
          :emissive="(stellarObject as Star).color"
          :emissive-intensity="settings.showBloom ? 3 : 1"
        />
      </TresMesh>
      <!--Planet-->
      <TresSprite
        v-if="stellarObject.type == 'Planet'"
        :name="stellarObject.name"
        :scale="PlanetDotScale"
        @click="emit('click')"
      >
        <TresSpriteMaterial :map="texture.map" :color="(stellarObject as Planet).uiColor" :size-attenuation="false" />
      </TresSprite>

      <primitive :object="label" />
    </TresGroup>
    <ScSystemStellarObjectEllipse
      v-if="stellarObject.type != 'Star'"
      :stellar-object="stellarObject"
      :system="system"
    />
  </TresGroup>
</template>
