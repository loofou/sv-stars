<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { System } from '~/utils/StarSystem';
import { ACESFilmicToneMapping } from 'three';

defineProps({
  systems: {
    type: Array<System>,
    required: true,
  },
});
</script>

<template>
  <TresCanvas alpha :tone-mapping="ACESFilmicToneMapping" clear-color="black" preset="flat" render-mode="on-demand">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" :position="[30, 30, 30]" />
    <OrbitControls :make-default="true" :max-distance="150" />

    <!--Render our actual systems-->
    <ScZoneSystem v-for="system in systems" :key="system.id" :system="system" />

    <Grid
      :args="[100, 100]"
      cell-color="#82dbc5"
      :cell-size="1"
      :cell-thickness="0.5"
      section-color="#fbb03b"
      :section-size="5"
      :section-thickness="1"
      :infinite-grid="true"
      :fade-from="0"
      :fade-distance="100"
      :fade-strength="2"
    />

    <!--Background stars-->
    <Stars :radius="150" :depth="25" :count="15000" :size="0.5" :size-attenuation="false" />
  </TresCanvas>
</template>
