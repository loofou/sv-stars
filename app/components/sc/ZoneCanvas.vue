<script lang="ts" setup>
import { NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { CameraControls } from '@tresjs/cientos';
import { System } from '~/utils/types';
import ZoneDistanceArrow from './ZoneDistanceArrow.vue';
import { DistanceMultiplier } from '~/utils/utils';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';
import type { ShallowRef } from 'vue';

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

const controlsState = reactive({
  minDistance: 0,
  maxDistance: 250,
});

const controlsRef = shallowRef();

const doubleClick = (object: ShallowRef) => {
  if (controlsRef.value) {
    const { x, y, z } = object.value.position;
    controlsRef.value.instance.setTarget(x, y, z, true);
  }
};
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.001, 5000]" :position="[30, 30, 30]" />
    <CameraControls ref="controlsRef" name="Controls" v-bind="controlsState" make-default />

    <!--Render our actual systems-->
    <ScZoneSystem
      v-for="system in getSystems"
      :system="system"
      :selected="system.name == selectedSystem"
      :distance01="system.name == distance01"
      :distance02="system.name == distance02"
      @click="emit('click', system)"
      @double-click="doubleClick"
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

    <!--Environment Backdrop-->
    <Suspense>
      <Environment v-if="settings.showBgStars" :background="true" files="textures/HDR_hazy_nebulae.hdr" />
    </Suspense>

    <!--Post-process effects-->
    <Suspense>
      <EffectComposer>
        <UnrealBloom v-if="settings.showBloom" :radius="0.05" :strength="0.5" :threshold="1" />
      </EffectComposer>
    </Suspense>
  </TresCanvas>
</template>
