<script lang="ts" setup>
import { Vector3, BufferGeometry, MathUtils, DoubleSide } from "three";
import SpriteText from 'three-spritetext';
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

//create label
const label = new SpriteText(props.star.name, 1);
label.strokeColor = "black";
label.strokeWidth = 1;
label.translateY(2 * props.star.radius);
</script>

<template>
  <TresGroup>
    <TresMesh :position="star.position" @click="emit('click')">
      <TresSphereGeometry :args="[star.radius, 32, 16]" />
      <TresMeshBasicMaterial :color="star.color" />

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
