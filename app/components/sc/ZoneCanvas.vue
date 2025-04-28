<script lang="ts" setup>
import { NoToneMapping } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { System } from '~/utils/StarSystem';
import { string } from 'three/tsl';

const emit = defineEmits<{
  click: [system: System];
}>();

defineProps({
  systems: {
    type: Array<System>,
    required: true,
  },
  selectedSystem: {
    type: String,
    default: '',
  },
  showBloom: {
    type: Boolean,
    default: true,
  },
  showGrid: {
    type: Boolean,
    default: true,
  },
  showBgStars: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <TresCanvas alpha :tone-mapping="NoToneMapping" clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[30, 30, 30]" />
    <OrbitControls :make-default="true" :max-distance="150" />

    <!--Render our actual systems-->
    <ScZoneSystem
      v-for="system in systems"
      :system="system"
      :selected="system.name == selectedSystem"
      @click="emit('click', system)"
    />

    <!--Grid-->
    <Grid
      v-if="showGrid"
      :args="[100, 100]"
      cell-color="grey"
      :cell-size="2"
      :cell-thickness="0.5"
      section-color="tan"
      :section-size="10"
      :section-thickness="0.8"
      :infinite-grid="true"
      :fade-from="0"
      :fade-distance="100"
      :fade-strength="2"
    />

    <!--Background stars-->
    <Stars v-if="showBgStars" :radius="150" :depth="25" :count="15000" :size="0.5" :size-attenuation="false" />

    <!--Post-process effects-->
    <Suspense>
      <EffectComposer>
        <UnrealBloom v-if="showBloom" :radius="0.05" :strength="0.5" :threshold="1" />
      </EffectComposer>
    </Suspense>
  </TresCanvas>
</template>
