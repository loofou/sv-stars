<script lang="ts" setup>
import { ArrowHelper, Vector3 } from 'three';
import { StarUtils } from '~/utils/utils';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  distance01: {
    type: System,
    required: true,
  },
  distance02: {
    type: System,
    required: true,
  },
});

const arrow = shallowRef(new ArrowHelper(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0, '#FFC300'));

watch(props, () => {
  const pos1 = StarUtils.convertToVec3(props.distance01.position);
  const pos2 = StarUtils.convertToVec3(props.distance02.position);
  pos1.multiplyScalar(2);
  pos2.multiplyScalar(2);

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
