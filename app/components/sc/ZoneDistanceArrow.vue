<script lang="ts" setup>
import { ArrowHelper, Vector3 } from 'three';
import { DistanceMultiplier, StarUtils } from '~/utils/utils';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  distance01: {
    type: String,
    required: true,
  },
  distance02: {
    type: String,
    required: true,
  },
});

const systems = useCatalog();

const arrow = shallowRef(new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0, '#FFC300'));

watch(props, () => {
  const system01Details = systems.state.value.find((s: System) => s.name === props.distance01) ?? new System();
  const system02Details = systems.state.value.find((s: System) => s.name === props.distance02) ?? new System();

  const pos1 = StarUtils.convertToVec3(system01Details.position);
  const pos2 = StarUtils.convertToVec3(system02Details.position);
  pos1.multiplyScalar(DistanceMultiplier);
  pos2.multiplyScalar(DistanceMultiplier);

  const dir = pos2.sub(pos1);
  const normalizedDir = new Vector3(dir.x, dir.y, dir.z);
  normalizedDir.normalize();
  const dirLength = dir.length();

  arrow.value = new ArrowHelper(normalizedDir, pos1, dirLength, '#FFC300', 0, 0);
});
</script>

<template>
  <primitive v-if="active" :object="arrow" />
</template>
