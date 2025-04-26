<script lang="ts" setup>
import { Star, System } from '~/utils/StarSystem';

useHead({
  title: 'Neighbourhood',
});

const systems: Array<System> = [
  new System('Sol', [new Star('Sol', 'yellow', 1)]),
  new System(
    'Alpha Centauri',
    [
      new Star('A Rigil Kentaurus', 'yellow', 0.8),
      new Star('B Toliman', 'yellow', 0.7),
      new Star('C Proxima Centauri', 'orange', 0.2),
    ],
    [12, 3, 6],
  ),
  new System('Sirius', [new Star('Sirius', 'teal', 2)], [-12, -3, 15]),
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
