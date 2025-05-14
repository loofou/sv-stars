<script lang="ts" setup>
import { merge } from 'lodash';
import type { TabsItem } from '@nuxt/ui';
import { System } from '~/utils/types';
import { StarUtils } from '~/utils/utils';
import { useSettings } from '~/composables/useSettings';
import { useCatalog } from '~/composables/useCatalog';

useHead({
  title: 'State Vector Star Catalog',
});

//Settings
const settings = useSettings();

//Default system
const systems = useCatalog();
const canvasKey = ref(0);

//loading & saving
const yamlAreaText = ref('');
const loadBarOpen = ref(false);

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
const selectedSystemDetails = ref(new System());

//distance
const distance01 = ref('');
const distance01Details = ref(new System());
const distance02 = ref('');
const distance02Details = ref(new System());

//Functions
function saveYaml() {
  const yamlString = StarUtils.convertToYaml(systems.state.value);
  StarUtils.saveToFile(yamlString, 'neighbourhood.yaml');
}

function loadYaml() {
  loadBarOpen.value = false;

  const newSystems = StarUtils.convertFromYaml(yamlAreaText.value);
  systems.state.value = newSystems;

  resetSelections();
  canvasKey.value += 1;
}

function mergeYaml() {
  loadBarOpen.value = false;

  const newSystems = StarUtils.convertFromYaml(yamlAreaText.value);
  systems.state.value = merge(systems.state.value, newSystems);

  resetSelections();
  canvasKey.value += 1;
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
        distance02Details.value = new System();
      } else if (system.name == distance02.value) {
        distance02.value = distance01.value;
        distance02Details.value = distance01Details.value;
        distance01.value = '';
        distance01Details.value = new System();
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
  selectedSystemDetails.value = new System();
  distance01Details.value = new System();
  distance02Details.value = new System();
}

watch(activeMode, () => {
  resetSelections();
});

watch(
  () => settings.value.showDwarfStars,
  () => {
    resetSelections();
    canvasKey.value += 1;
  },
);
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <NavSettingsPanel />

      <USeparator label="Save & Load Config" class="my-2" />
      <div class="py-2 flex flex-row gap-2">
        <UButton class="grow" icon="uil-file-export" label="Save" variant="subtle" @click="saveYaml" />
        <UPopover arrow v-model:open="loadBarOpen">
          <UButton class="grow" icon="uil-file-import" label="Load" variant="subtle" />

          <template #content>
            <UTextarea v-model="yamlAreaText" class="m-1 inline-flex" placeholder="Enter YAML here" />
            <div class="flex flex-col">
              <UButton class="m-1" icon="uil-file-import" label="Load & Replace" @click="loadYaml" />
              <UButton class="m-1" icon="material-symbols:cell-merge" label="Load & Merge" @click="mergeYaml" />
            </div>
          </template>
        </UPopover>
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
          :key="canvasKey"
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
