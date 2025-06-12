<script lang="ts" setup>
const props = defineProps({
  distance01: {
    type: String,
    required: true,
  },
  distance02: {
    type: String,
    required: true,
  },
});

const catalog = useCatalog();

const distance = computed(() => {
  const system01Details = catalog.state.value.find((s: System) => s.name === props.distance01) ?? new System();
  const system02Details = catalog.state.value.find((s: System) => s.name === props.distance02) ?? new System();

  const [x1, y1, z1] = system01Details.position;
  const [x2, y2, z2] = system02Details.position;

  return Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)));
});
</script>

<template>
  <div>
    <p v-if="!(distance01 || distance02)">Click on two systems to select them...</p>
    <p v-if="(distance01 || distance02) && !(distance01 && distance02)">Click on a second system to select it.</p>
    <p v-if="distance01 && distance02">
      Distance between {{ distance01 }} and {{ distance02 }}:<br />{{ distance.toFixed(2) }} ly
    </p>
  </div>
</template>
