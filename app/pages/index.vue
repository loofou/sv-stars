<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';
import { defaultSystems } from '~/utils/DefaultStars';
import { System } from '~/utils/StarSystem';
import { StarUtils } from '~/utils/utils';

useHead({
  title: 'State Vector Star Catalog',
});

//Config
const showBloom = ref(true);
const showGrid = ref(true);
const showBgStars = ref(true);

//Default system
const systems = ref(defaultSystems);

//modes
const activeMode = ref('0');
const modes: TabsItem[] = [
  {
    label: 'Select',
    icon: 'material-symbols:arrow-selector-tool',
  },
  {
    label: 'Distance',
    icon: 'ri:pin-distance-fill',
  },
];

//selection
const selectedSystem = ref('');
const selectedSystemDetails = ref(System.Empty);

//distance
const distance01 = ref('');
const distance01Details = ref(System.Empty);
const distance02 = ref('');
const distance02Details = ref(System.Empty);

//Functions
function saveYaml() {
  const yamlString = StarUtils.convertToYaml(systems.value);
  StarUtils.saveToFile(yamlString, 'neighbourhood.yaml');
}

function onSystemClick(system: System) {
  if (activeMode.value == '0') {
    selectedSystem.value = system.name;
    selectedSystemDetails.value = system;
  } else if (activeMode.value == '1') {
    if (distance01.value == '') {
      distance01.value = system.name;
      distance01Details.value = system;
    } else {
      if (system.name == distance01.value) {
        distance01.value = distance02.value;
        distance01Details.value = distance02Details.value;
        distance02.value = '';
        distance02Details.value = System.Empty;
      } else if (system.name == distance02.value) {
        distance02.value = distance01.value;
        distance02Details.value = distance01Details.value;
        distance01.value = '';
        distance01Details.value = System.Empty;
      } else {
        distance02.value = system.name;
        distance02Details.value = system;
      }
    }
  }
}

function resetSelections() {
  selectedSystem.value = '';
  distance01.value = '';
  distance02.value = '';
  selectedSystemDetails.value = System.Empty;
  distance01Details.value = System.Empty;
  distance02Details.value = System.Empty;
}

watch(activeMode, () => {
  resetSelections();
});
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
        <UButton class="grow" icon="uil-file-export" label="Save" variant="subtle" @click="saveYaml" />
        <UButton class="grow" icon="uil-file-import" label="Load" variant="subtle" disabled />
      </div>
      <USeparator label="Mode" class="my-2" />
      <UTabs v-model="activeMode" :items="modes" class="w-full">
        <template #content="{ item }">
          <div class="grow min-h-0 p-2 rounded-md border border-solid border-gray-600">
            <ScZoneSystemDetails
              v-if="item.label == 'Select'"
              :isSystemSelected="selectedSystem != ''"
              :system="selectedSystemDetails"
            />
            <ScZoneDistanceDetails
              v-if="item.label == 'Distance'"
              :distance01
              :distance02
              :distance01Details
              :distance02Details
            />
          </div>
        </template>
      </UTabs>
    </NavBar>
    <NavContainer>
      <div class="grow">
        <ScZoneCanvas
          :systems
          :showBloom
          :showGrid
          :showBgStars
          :selectedSystem
          :distance01
          :distance02
          :distance01Details
          :distance02Details
          @click="onSystemClick"
        />
      </div>
    </NavContainer>
  </div>
</template>
