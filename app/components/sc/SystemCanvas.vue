<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

const planets = [5, 10, 15]
</script>

<template>
  <TresCanvas alpha shadow clear-color="black" preset="flat">
    <TresPerspectiveCamera :args="[45, 1, 0.1, 1000]" />
    <OrbitControls :make-default="true" :max-distance="150" />

    <Sphere :args="[0.5]" color="yellow" />

    <Sphere v-for="planet in planets" :key="planet" :args="[0.3]" :position="[planet,0,0]"  color="grey" />

    <Stars :radius="150" :depth="25" :count="15000" :size="0.5" :size-attenuation="false" />
  </TresCanvas>
</template>
