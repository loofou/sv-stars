<script lang="ts" setup>
import { System, Star } from '~/utils/types';

const catalog = useCatalog();

const props = defineProps({
  isSystemSelected: {
    type: Boolean,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
});

function createItems(system: System) {
  const starChildren: any[] = [
    {
      label: `${system.position.map((pos) => pos.toFixed(2)).join(', ')}`,
      value: `${system.name}-pos`,
      icon: 'solar:map-point-bold',
    },
    {
      label: `Planets: ${system.planetNumber}`,
      value: `${system.name}-planetNum`,
      icon: 'tabler:world-plus',
    },
  ];
  system.stars.forEach((star: Star) => {
    starChildren.push({
      label: star.name,
      value: `star-${star.name}`,
      icon: 'material-symbols:sunny',
      defaultExpanded: true,
      children: [
        {
          label: `S. Class: ${star.spectralClass}`,
          value: `${star.name}-sc`,
          icon: 'material-symbols:cards-star-outline',
        },
        {
          label: `Temp: ${star.temperature} K`,
          value: `${star.name}-temp`,
          icon: 'uil:temperature-half',
        },
        {
          label: `Mass: ${star.mass} SM`,
          value: `${star.name}-mass`,
          icon: 'gravity-ui:weight-hanging',
        },
        {
          label: `Radius: ${star.radius} SR`,
          value: `${star.name}-rad`,
          icon: 'oui:radius',
        },
      ],
    });
  });

  const expanded = ['system'];
  system.stars.forEach((star: Star) => {
    expanded.push(`star-${star.name}`);
  });

  return {
    tree: [
      {
        label: system.name,
        value: 'system',
        icon: 'game-icons:orbital',
        defaultExpanded: true,
        children: starChildren,
      },
    ],
    expanded: expanded,
  };
}

let systemDetails = catalog.state.value.find((s: System) => s.name === props.system) ?? new System();
const allItems = createItems(systemDetails);
const items = ref(allItems.tree);
const expanded = ref(allItems.expanded);

watch(props, () => {
  systemDetails = catalog.state.value.find((s: System) => s.name === props.system) ?? new System();
  const allItems = createItems(systemDetails);
  items.value = allItems.tree;
  expanded.value = allItems.expanded;
});
</script>

<template>
  <div>
    <p v-if="!isSystemSelected">Click on a system to select it...</p>
    <UTree v-if="isSystemSelected" v-model:expanded="expanded" :items />
    <div class="flex flex-col items-center gap-2 justify-between">
      <UButton v-if="isSystemSelected" class="m-2 self-center" icon="mdi:arrow-bottom-right-thin" variant="subtle">
        <NuxtLink :to="`/${system}`"> Go to system </NuxtLink>
      </UButton>
    </div>
  </div>
</template>
