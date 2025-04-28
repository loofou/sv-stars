<script lang="ts" setup>
import { Star, System } from '~/utils/StarSystem';
import { StarUtils } from '~/utils/utils';

useHead({
  title: 'State Vector Star Catalog',
});

//Config
const showBloom = ref(true);
const showGrid = ref(true);
const showBgStars = ref(true);

//Default system
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

//selection
const selectedSystem = ref('');
const selectedSystemDetails = ref(new System('', []));

//Functions
function saveJson() {
  const jsonString = JSON.stringify(systems);
  StarUtils.saveToFile(jsonString, 'neighbourhood.json');
}

function canvasClick(system: System) {
  selectedSystem.value = system.name;
  selectedSystemDetails.value = system;
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <UCollapsible class="flex flex-col gap-2">
        <UButton label="Settings" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-down" block />
        <template #content>
          <div class="p-3 rounded-md border border-solid border-gray-600">
            <USwitch class="p-1" label="Show Bloom" v-model="showBloom" />
            <USwitch class="p-1" label="Show Grid" v-model="showGrid" />
            <USwitch class="p-1" label="Show Background Stars" v-model="showBgStars" />
          </div>
        </template>
      </UCollapsible>
      <USeparator label="Save & Load Config" class="my-2" />
      <div class="py-2 flex flex-row gap-2">
        <UButton class="grow" icon="uil-file-export" label="Save" variant="subtle" @click="saveJson" />
        <UButton class="grow" icon="uil-file-import" label="Load" variant="subtle" disabled />
      </div>
      <USeparator label="Selection" class="my-2" />
      <div class="grow min-h-0 p-2 rounded-md border border-solid border-gray-600">
        <ScZoneSystemDetails :isSystemSelected="selectedSystem != ''" :system="selectedSystemDetails" />
      </div>
    </NavBar>
    <NavContainer>
      <div class="grow">
        <ScZoneCanvas :systems :showBloom :showGrid :showBgStars :selectedSystem @click="canvasClick" />
      </div>
    </NavContainer>
  </div>
</template>
