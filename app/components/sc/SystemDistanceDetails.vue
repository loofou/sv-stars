<script lang="ts" setup>
import { Vector3 } from 'three';
import { calcAbsolutePosition } from '~/utils/physics';

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

  const pos01 = calcAbsolutePosition(object01, systemDetails, time.value.currentTime).multiplyScalar(1 / AUMultiplier);
  const pos02 = calcAbsolutePosition(object02, systemDetails, time.value.currentTime).multiplyScalar(1 / AUMultiplier);

  const [x1 = 0, y1 = 0, z1 = 0] = pos01;
  const [x2 = 0, y2 = 0, z2 = 0] = pos02;

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
      Distance between {{ distance01 }} and {{ distance02 }}: <br />{{ distance.toFixed(2) }} AU <br />{{
        astronomicalUnitsToKilometers(distance).toFixed(2)
      }}
      km
    </p>
  </div>
</template>
