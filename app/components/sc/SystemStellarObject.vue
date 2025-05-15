<script lang="ts" setup>
import { Vector3, Color } from 'three';
import SpriteText from 'three-spritetext';
import { calcOrbitalPosition } from '~/utils/physics';
import type { Planet } from '~/utils/types';
import { AUMultiplier, StarRadiusMultiplier, PlanetRadiusMultiplier } from '~/utils/utils';

const emit = defineEmits(['click']);

const props = defineProps({
  stellarObject: {
    type: StellarObject,
    required: true,
  },
});

const settings = useSettings();

//orbit
const position = ref(new Vector3());
if (!props.stellarObject.parent) {
  position.value = new Vector3(0, 0, 0);
} else {
  //orbital calculations
  position.value = calcOrbitalPosition(props.stellarObject.orbit);
  position.value.multiplyScalar(AUMultiplier);
}

//create label
const labelColor = ref('white');
//if (props.selected) labelColor.value = 'green';

const label = shallowRef(new SpriteText(props.stellarObject.name, 1));
label.value.name = 'label';
label.value.color = labelColor.value;
label.value.strokeColor = 'black';
label.value.strokeWidth = 1;
label.value.translateY(3);

watch(props, () => {
  /*if (props.selected) labelColor.value = 'green';
  else if (props.distance01) labelColor.value = 'yellow';
  else if (props.distance02) labelColor.value = 'orange';
  else labelColor.value = 'white';*/

  label.value = new SpriteText(props.stellarObject.name, 1);
  label.value.name = 'label';
  label.value.color = labelColor.value;
  label.value.strokeColor = 'black';
  label.value.strokeWidth = 1;
  label.value.translateY(3);
});
</script>

<template>
  <TresGroup :name="stellarObject.name">
    <TresGroup :position>
      <TresMesh :name="stellarObject.name" @click="emit('click')">
        <!--Star-->
        <TresSphereGeometry
          v-if="stellarObject.type == 'Star'"
          :args="[Math.max(0.05, ((stellarObject as Star).radius ?? 1) * StarRadiusMultiplier), 32, 16]"
        />
        <TresMeshStandardMaterial
          v-if="stellarObject.type == 'Star'"
          :color="(stellarObject as Star).color"
          :emissive="(stellarObject as Star).color"
          :emissive-intensity="settings.showBloom ? 3 : 1"
        />
        <TresPointLight
          v-if="stellarObject.type == 'Star'"
          :color="(stellarObject as Star).color"
          :intensity="10"
          :distance="100"
        />

        <!--Planet-->
        <TresSphereGeometry
          v-if="stellarObject.type == 'Planet'"
          :args="[Math.max(0.05, ((stellarObject as Planet).radius ?? 1) * PlanetRadiusMultiplier), 32, 16]"
        />
        <TresMeshStandardMaterial v-if="stellarObject.type == 'Planet'" :color="new Color('#ababab')" />
      </TresMesh>

      <primitive :object="label" />
    </TresGroup>
  </TresGroup>
</template>
