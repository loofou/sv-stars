<script lang="ts" setup>
import { useLoop } from '@tresjs/core';
import { useStarTime } from '~/composables/useStarTime';

const { onBeforeRender } = useLoop();
const time = useStarTime();

onBeforeRender(({ delta }) => {
  if (time.value.stopped) return;
  const currentTime = time.value.currentTime.valueOf();
  const newTime = currentTime + delta * time.value.speed * 1000;
  time.value.currentTime = new Date(newTime);
});
</script>

<template>
  <TresObject3D :name="'time-updater'" :visible="false" />
</template>
