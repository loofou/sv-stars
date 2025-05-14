<script lang="ts" setup>
import { Vector3, BufferGeometry, MathUtils, DoubleSide, Object3D, Color } from 'three';
import SpriteText from 'three-spritetext';
import { shallowRef } from 'vue';
import { useSettings } from '~/composables/useSettings';
import { System } from '~/utils/types';
import { DistanceMultiplier, RadiusMultiplier, StarUtils } from '~/utils/utils';

const { onBeforeRender } = useLoop();

const emit = defineEmits(['click']);

const props = defineProps({
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

//calculate various positions
const sysPos = StarUtils.convertToVec3(props.system.position); //props.system.position.map((a) => a * 2) as [number, number, number];
sysPos.multiplyScalar(DistanceMultiplier);
const zeroPosition = new Vector3(sysPos.x, 0, sysPos.z);

//create geometry for line
const linePoints: Vector3[] = [];
linePoints.push(sysPos);
linePoints.push(zeroPosition);
const geometry = new BufferGeometry().setFromPoints(linePoints);

//create label
const labelColor = ref('white');
if (props.selected) labelColor.value = 'green';

const label = shallowRef(new SpriteText(props.system.name, 1));
label.value.name = 'label';
label.value.color = labelColor.value;
label.value.strokeColor = 'black';
label.value.strokeWidth = 1;
label.value.translateY(3);

watch(props, () => {
  if (props.selected) labelColor.value = 'green';
  else if (props.distance01) labelColor.value = 'yellow';
  else if (props.distance02) labelColor.value = 'orange';
  else labelColor.value = 'white';

  label.value = new SpriteText(props.system.name, 1);
  label.value.name = 'label';
  label.value.color = labelColor.value;
  label.value.strokeColor = 'black';
  label.value.strokeWidth = 1;
  label.value.translateY(3);
});

//animate multi-star systems
const rStars = shallowRef();
const originRadius: number = props.system.stars[0]?.radius as number;

onBeforeRender(({ delta, elapsed }) => {
  if (rStars.value) {
    //We need to reverse because the shallow-ref reverses the order of the v-for array
    const stars: Array<Object3D> = rStars.value.toReversed();
    stars.forEach((star: Object3D, i: number) => {
      if (star && star.position && i > 0) {
        const rotation = (1 / i) * elapsed;
        const radius = i * (2 * originRadius * RadiusMultiplier);
        star.position.x = radius * Math.cos(rotation);
        star.position.z = radius * Math.sin(rotation);
      }
    });
  }
});
</script>

<template>
  <TresGroup :name="system.name">
    <TresGroup :position="sysPos">
      <TresMesh v-if="system.stars.length === 1" :name="system.stars[0]?.name" @click="emit('click')">
        <TresSphereGeometry :args="[Math.max(0.05, (system.stars[0]?.radius ?? 1) * RadiusMultiplier), 32, 16]" />
        <TresMeshStandardMaterial
          :color="system.stars[0]?.color"
          :emissive="system.stars[0]?.color"
          :emissive-intensity="settings.showBloom ? 3 : 1"
        />
      </TresMesh>

      <TresMesh
        v-if="system.stars.length > 1"
        v-for="(star, i) in system.stars"
        :key="i"
        :name="star.name"
        ref="rStars"
        @click="emit('click')"
      >
        <TresSphereGeometry :args="[Math.max(0.05, star.radius * RadiusMultiplier), 32, 16]" />
        <TresMeshStandardMaterial
          :color="star.color"
          :emissive="star.color"
          :emissive-intensity="settings.showBloom ? 3 : 1"
        />
      </TresMesh>

      <primitive :object="label" />
    </TresGroup>

    <TresLine name="line" :geometry>
      <TresLineBasicMaterial color="gray" />
    </TresLine>

    <TresMesh name="lineDisk" :position="zeroPosition" :rotate-x="MathUtils.degToRad(-90)">
      <TresCircleGeometry :args="[0.2, 6]" />
      <TresMeshBasicMaterial color="gray" transparent :opacity="0.5" :side="DoubleSide" />
    </TresMesh>
  </TresGroup>
</template>
