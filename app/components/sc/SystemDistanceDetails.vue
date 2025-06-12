<script lang="ts" setup>
import { Vector3 } from 'three';

const props = defineProps({
  distance01: {
    type: String,
    required: true,
  },
  distance02: {
    type: String,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
});

const catalog = useCatalog();
const time = useStarTime();

const distance = computed(() => {
  const systemDetails = catalog.state.value.find((s: System) => s.name === props.system) ?? new System();
  const object01 = systemDetails.objects.find((s: StellarObject) => s.name === props.distance01) ?? new StellarObject();
  const object02 = systemDetails.objects.find((s: StellarObject) => s.name === props.distance02) ?? new StellarObject();

  const parent01 = object01.getParent(systemDetails);
  const parent02 = object02.getParent(systemDetails);

  const parent01Mass =
    parent01?.type == StellarTypes.STAR ? solarMassesToKg(parent01.mass) : earthMassesToKg(parent01?.mass ?? 0);
  const parent02Mass =
    parent02?.type == StellarTypes.STAR ? solarMassesToKg(parent02.mass) : earthMassesToKg(parent02?.mass ?? 0);
  const pos01 = calcOrbitInTime(object01.orbit, parent01Mass, time.value.currentTime);
  const pos02 = calcOrbitInTime(object02.orbit, parent02Mass, time.value.currentTime);

  const [x1 = 0, y1 = 0, z1 = 0] = pos01 ?? [0, 0, 0];
  const [x2 = 0, y2 = 0, z2 = 0] = pos02 ?? [0, 0, 0];

  console.log('Calculating distance between', object01.name, 'and', object02.name);
  console.log('Positions:', pos01, pos02);

  return Math.abs(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)));
});
</script>

<template>
  <div>
    <p v-if="!(distance01 || distance02)">Click on two stellar objects to select them...</p>
    <p v-if="(distance01 || distance02) && !(distance01 && distance02)">
      Click on a second stellar object to select it.
    </p>
    <p v-if="distance01 && distance02">
      Distance between {{ distance01 }} and {{ distance02 }}:<br />{{ distance.toFixed(2) }} AU
    </p>
  </div>
</template>
