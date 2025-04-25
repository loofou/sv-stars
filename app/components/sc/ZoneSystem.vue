<script lang="ts" setup>
import { Vector3, BufferGeometry, MathUtils, DoubleSide } from 'three';
import SpriteText from 'three-spritetext';
import { System } from '~/utils/StarSystem';

const emit = defineEmits(['click']);

const props = defineProps({
  system: {
    type: System,
    required: true,
  },
});

//calculate various positions
const [x, y, z] = props.system.position;
const zeroPosition = new Vector3(x, 0, z);

//create geometry for line
const linePoints: Vector3[] = [];
linePoints.push(new Vector3(x, y, z));
linePoints.push(zeroPosition);
const geometry = new BufferGeometry().setFromPoints(linePoints);

//create label
const label = new SpriteText(props.system.name, 1);
label.strokeColor = 'black';
label.strokeWidth = 1;
label.translateY(2 * (props.system.stars[0]?.radius ?? 1));
</script>

<template>
  <TresGroup>
    <TresMesh :position="system.position" @click="emit('click')">
      <TresSphereGeometry :args="[system.stars[0]?.radius, 32, 16]" />
      <TresMeshBasicMaterial :color="system.stars[0]?.color" />

      <primitive :object="label" />
    </TresMesh>

    <TresLine :geometry>
      <TresLineBasicMaterial color="gray" />
    </TresLine>

    <TresMesh :position="zeroPosition" :rotate-x="MathUtils.degToRad(-90)">
      <TresCircleGeometry :args="[0.2, 6]" />
      <TresMeshBasicMaterial color="gray" transparent :opacity="0.5" :side="DoubleSide" />
    </TresMesh>
  </TresGroup>
</template>
