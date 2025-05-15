<script lang="ts" setup>
import { NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { StellarObject, System } from '~/utils/types';
import { DistanceMultiplier } from '~/utils/utils';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';

const emit = defineEmits<{
  click: [stellarObject: StellarObject];
}>();

const props = defineProps({
  system: {
    type: String,
    required: true,
  },
});

const systems = useCatalog();
const settings = useSettings();

const thisSystem = computed(() => {
  return systems.state.value.find((system: System) => system.name === props.system);
});
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[30, 30, 30]" />
    <OrbitControls :make-default="true" :max-distance="150" />

    <ScSystemStellarObject
      v-for="stellarObject in thisSystem?.objects"
      :key="stellarObject.name"
      :stellar-object="stellarObject"
      @click="emit('click', stellarObject)"
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
