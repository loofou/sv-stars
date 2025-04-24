<script lang="ts" setup>
const emit = defineEmits(['click'])

</script>

<template>
  <TresMesh ref="rMesh" @click="emit('click')">
    <TresSphereGeometry />
    <TresMeshBasicMaterial color="yellow" />
  </TresMesh>
</template>