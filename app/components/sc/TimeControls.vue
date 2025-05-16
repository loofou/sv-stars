<script lang="ts" setup>
import { useStarTime } from '~/composables/useStarTime';
import { datetimeToHumanReadable, humanTime, Time } from '~/utils/epoch';

const time = useStarTime();

const timeSpeeds = [
  Time.SECOND,
  Time.MINUTE,
  Time.HOUR,
  Time.HOUR * 6,
  Time.HOUR * 12,
  Time.DAY,
  Time.DAY * 3,
  Time.WEEK,
  Time.MONTH,
  Time.MONTH * 3,
  Time.MONTH * 6,
  Time.YEAR,
];

const stopStartTime = () => {
  time.value.stopped = !time.value.stopped;
};

const startStopButtonIcon = computed(() => {
  return time.value.stopped ? 'mdi:play' : 'mdi:pause';
});

const incrementSpeed = () => {
  const currentIndex = timeSpeeds.indexOf(time.value.speed);
  if (currentIndex < timeSpeeds.length - 1) {
    const nextSpeed = timeSpeeds[currentIndex + 1];
    if (nextSpeed !== undefined) {
      time.value.speed = nextSpeed as Time;
    }
  }
};

const decrementSpeed = () => {
  const currentIndex = timeSpeeds.indexOf(time.value.speed);
  if (currentIndex > 0) {
    const prevSpeed = timeSpeeds[currentIndex - 1];
    if (prevSpeed !== undefined) {
      time.value.speed = prevSpeed as Time;
    }
  }
};
</script>

<template>
  <div class="flex flex-row items-center gap-2 justify-between">
    <div class="bg-gray-700 rounded-lg px-4 py-2 grow">
      <span class="text-sm">
        {{ datetimeToHumanReadable(time.currentTime) }}
      </span>
      <div class="flex flex-col items-center gap-2 justify-between">
        <div class="flex flex-row items-center gap-2 my-2">
          <UButton :icon="startStopButtonIcon" variant="subtle" @click="stopStartTime" />
          <UButton icon="mdi:chevron-left" variant="subtle" @click="decrementSpeed" />
          <span class="text-sm"> {{ humanTime(time.speed) }} / sec </span>
          <UButton icon="mdi:chevron-right" variant="subtle" @click="incrementSpeed" />
        </div>
      </div>
    </div>
  </div>
</template>
