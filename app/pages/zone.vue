<script lang="ts" setup>
import { Star, System } from '~/utils/StarSystem';

useHead({
  title: 'Neighbourhood',
});

const systems: Array<System> = [
  new System('Sol', [new Star('Sol', 'G2V', 5772, 1, 1)]),
  new System(
    'Alpha Centauri',
    [
      new Star('A Rigil Kentaurus', 'G2V', 5804, 1.07, 1.27),
      new Star('B Toliman', 'K1V', 5207, 0.9, 0.85),
      new Star('C Proxima Centauri', 'M5V', 2992, 0.12, 0.15),
    ],
    [12, 3, 6],
  ),
  new System(
    'Sirius',
    [new Star('A Sirius', 'A0V', 9845, 2.06, 1.71), new Star('B Sirius', 'D2-', 25000, 1.02, 0.08)],
    [-12, -3, 15],
  ),
];
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <NavButton icon="uil:home" href="/"> Home </NavButton>
      <NavButton icon="uil:star" href="/zone"> Neighbourhood </NavButton>
    </NavBar>
    <NavContainer>
      <div class="flex grow">
        <ScZoneCanvas :systems />
      </div>
    </NavContainer>
  </div>
</template>
