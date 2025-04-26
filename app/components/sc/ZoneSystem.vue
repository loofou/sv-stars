<script lang="ts" setup>
import { Vector3, BufferGeometry, MathUtils, DoubleSide, Object3D } from 'three';
import SpriteText from 'three-spritetext';
import { shallowRef } from 'vue';
import { System } from '~/utils/StarSystem';

const { onBeforeRender } = useLoop();

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

//animate multi-star systems
const rStars = shallowRef();
onBeforeRender(({ delta, elapsed }) => {
  if (rStars.value) {
    rStars.value.forEach((star: Object3D, i: number) => {
      if (star && star.position && i > 0) {
        const rotation = (1 / i) * elapsed;
        star.position.x = i * Math.cos(rotation);
        star.position.z = i * Math.sin(rotation);
      }
    });
  }
});
</script>

<template>
  <TresGroup>
    <TresGroup :position="system.position">
      <TresMesh v-if="system.stars.length === 1" @click="emit('click')">
        <TresSphereGeometry :args="[system.stars[0]?.radius, 32, 16]" />
        <TresMeshBasicMaterial :color="system.stars[0]?.color" />
      </TresMesh>

      <TresMesh
        v-if="system.stars.length > 1"
        v-for="star in system.stars"
        :key="star.name"
        ref="rStars"
        @click="emit('click')"
      >
        <TresSphereGeometry :args="[star.radius / 2, 32, 16]" />
        <TresMeshBasicMaterial :color="star.color" />
      </TresMesh>

      <primitive :object="label" />
    </TresGroup>

    <TresLine :geometry>
      <TresLineBasicMaterial color="gray" />
    </TresLine>

    <TresMesh :position="zeroPosition" :rotate-x="MathUtils.degToRad(-90)">
      <TresCircleGeometry :args="[0.2, 6]" />
      <TresMeshBasicMaterial color="gray" transparent :opacity="0.5" :side="DoubleSide" />
    </TresMesh>
  </TresGroup>
</template>
