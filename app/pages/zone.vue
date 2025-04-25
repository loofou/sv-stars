<script lang="ts" setup>
import { ZoneStar } from '~/utils/TypeZoneStar';

useHead({
  title: 'Neighbourhood',
});

const stars: Array<ZoneStar> = [
  new ZoneStar('Sol', 'yellow', 1),
  new ZoneStar('Alpha Centauri', 'orange', 0.6, [12, 3, 6]),
  new ZoneStar('Sirius', 'teal', 1.1, [-12, -3, 15]),
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
        <ScZoneCanvas :stars />
      </div>
    </NavContainer>
  </div>
</template>
