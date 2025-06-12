<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui';

const route = useRoute();

const system: string = route.params.system as string;

useHead({
  title: `State Vector Star Catalog - ${system}`,
});

//Settings
const settings = useSettings();
const canvasKey = ref(0);

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
const selectedObject = ref('');

//distance
const distance01 = ref('');
const distance02 = ref('');

function onObjectClick(stellarObject: StellarObject) {
  if (activeMode.value == '0') {
    selectedObject.value = stellarObject.name;
  } else if (activeMode.value == '1') {
    if (distance01.value == '') {
      distance01.value = stellarObject.name;
    } else {
      if (stellarObject.name == distance01.value) {
        distance01.value = distance02.value;
        distance02.value = '';
      } else if (stellarObject.name == distance02.value) {
        distance02.value = distance01.value;
        distance01.value = '';
      } else {
        distance02.value = stellarObject.name;
      }
    }
  }
}

function resetSelections() {
  selectedObject.value = '';
  distance01.value = '';
  distance02.value = '';
}

watch(activeMode, () => {
  resetSelections();
});

watch(
  () => settings.value.showBgStars,
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
      <USeparator :label="system" class="my-2 font-extrabold" />
      <div class="flex flex-col items-center gap-2 justify-between">
        <UButton class="m-2 self-center" icon="mdi:arrow-top-left-thin" variant="subtle">
          <NuxtLink to="/"> Back to Neighbourhood </NuxtLink>
        </UButton>
      </div>
      <USeparator label="Time Controls" class="my-2" />
      <ScTimeControls />
      <USeparator label="Mode" class="my-2" />
      <UTabs v-model="activeMode" :items="modes" class="w-full">
        <template #content="{ item }">
          <div class="grow min-h-0 p-2 rounded-md border border-solid border-gray-600">
            <ScSystemDetails
              v-if="item.label == 'Select'"
              :isObjectSelected="selectedObject != ''"
              :object="selectedObject"
              :system
            />
            <ScSystemDistanceDetails v-if="item.label == 'Distance'" :distance01 :distance02 :system />
          </div>
        </template>
      </UTabs>
    </NavBar>
    <NavContainer>
      <div class="grow">
        <ScSystemCanvas :key="canvasKey" :system :selectedObject :distance01 :distance02 @click="onObjectClick" />
      </div>
    </NavContainer>
  </div>
</template>
