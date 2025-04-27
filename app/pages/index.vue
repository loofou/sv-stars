<script lang="ts" setup>
import { Star, System } from '~/utils/StarSystem';

useHead({
  title: 'Neighbourhood',
});

const showBloom = ref(true);

const systems: Array<System> = [
  new System('Sol', [new Star('Sol', 'G2V', 5772, 1, 1)]),
  new System(
    'Alpha Centauri',
    [
      new Star('Rigil Kentaurus A', 'G2V', 5804, 1.07, 1.27),
      new Star('Toliman B', 'K1V', 5207, 0.9, 0.85),
      new Star('Proxima Centauri', 'M5V', 2992, 0.12, 0.15),
    ],
    [3.046447, -0.05177, -3.125542],
  ),
  new System(
    'Sirius',
    [new Star('Sirius A', 'A0V', 9845, 2.06, 1.71), new Star('Sirius B', 'D2', 25000, 1.02, 0.08)],
    [6.224771, -1.326405, 5.7581],
  ),
  new System(
    'Procyon',
    [new Star('Procyon A', 'F5V', 6582, 1.48, 2.04), new Star('Procyon B', 'DQZ', 7740, 0.59, 0.05)],
    [6.183196, 2.576612, 9.270545],
  ),
  new System('Epsilon Eridani', [new Star('Epsilon Eridani', 'K2V', 5076, 0.85, 0.88)], [1.913, -7.794, 6.739]),
];
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <UCheckbox v-model="showBloom" />
    </NavBar>
    <NavContainer>
      <div class="flex grow">
        <ScZoneCanvas :systems :showBloom />
      </div>
    </NavContainer>
  </div>
</template>
