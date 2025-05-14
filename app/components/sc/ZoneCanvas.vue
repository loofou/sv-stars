<script lang="ts" setup>
import { NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { System } from '~/utils/types';
import ZoneDistanceArrow from './ZoneDistanceArrow.vue';
import { DistanceMultiplier } from '~/utils/utils';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';

const emit = defineEmits<{
  click: [system: System];
}>();

const props = defineProps({
  selectedSystem: {
    type: String,
    default: '',
  },
  distance01: {
    type: String,
    default: '',
  },
  distance02: {
    type: String,
    default: '',
  },
  distance01Details: {
    type: System,
    required: true,
  },
  distance02Details: {
    type: System,
    required: true,
  },
});

const systems = useCatalog();
const settings = useSettings();

const getSystems = computed(() => {
  if (settings.value.showDwarfStars) {
    return systems.state.value;
  } else {
    return systems.state.value.filter((s: System) => !s.isDwarfStar);
  }
});
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[30, 30, 30]" />
    <OrbitControls :make-default="true" :max-distance="150" />

    <!--Render our actual systems-->
    <ScZoneSystem
      v-for="system in getSystems"
      :system="system"
      :selected="system.name == selectedSystem"
      :distance01="system.name == distance01"
      :distance02="system.name == distance02"
      @click="emit('click', system)"
    />

    <!--Distance arrow-->
    <ZoneDistanceArrow
      :active="distance01 != '' && distance02 != ''"
      :distance01="distance01Details"
      :distance02="distance02Details"
    />

    <!--Grid-->
    <Grid
      v-if="settings.showGrid"
      :args="[100, 100]"
      cell-color="grey"
      :cell-size="DistanceMultiplier"
      :cell-thickness="0.5"
      section-color="tan"
      :section-size="DistanceMultiplier * 5"
      :section-thickness="0.8"
      :infinite-grid="true"
      :fade-from="0"
      :fade-distance="100"
      :fade-strength="2"
    />

    <!--Background stars-->
    <Stars v-if="settings.showBgStars" :radius="150" :depth="25" :count="15000" :size="0.5" :size-attenuation="false" />

    <!--Post-process effects-->
    <Suspense>
      <EffectComposer>
        <UnrealBloom v-if="settings.showBloom" :radius="0.05" :strength="0.5" :threshold="1" />
      </EffectComposer>
    </Suspense>
  </TresCanvas>
</template>
