<script lang="ts" setup>
import { Vector3, BufferGeometry, MathUtils, DoubleSide } from "three";
import { Html } from '@tresjs/cientos'
import { ZoneStar } from './TypeZoneStar';

const emit = defineEmits(['click']);

const props = defineProps({
  star: {
    type: ZoneStar,
    required: true
  }
});

//calculate various positions
const [x, y, z] = props.star.position;
const zeroPosition = new Vector3(x, 0, z);

//create geometry for line
const linePoints: Array<Vector3> = [];
linePoints.push(new Vector3(x, y, z));
linePoints.push(zeroPosition);
const geometry = new BufferGeometry().setFromPoints(linePoints);
</script>

<template>
  <TresGroup>
    <TresMesh :position="star.position" @click="emit('click')">
      <TresSphereGeometry :args="[star.radius, 32, 16]" />
      <TresMeshBasicMaterial :color="star.color" />

      <Html transform sprite> <!--:position="[star.position[0], star.position[1], star.position[2]]"-->
        <span class="label">{{ star.name }}</span>
      </Html>
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

<style>
.label {
  color: #FFF;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, .6);
}
</style>