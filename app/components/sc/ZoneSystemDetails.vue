<script lang="ts" setup>
const props = defineProps({
  isSystemSelected: {
    type: Boolean,
    required: true,
  },
  system: {
    type: System,
    required: true,
  },
});

function createItems(system: System) {
  const starChildren: any[] = [
    {
      label: `${system.position.join(', ')}`,
      value: `${system.name}-pos`,
      icon: 'solar:map-point-bold',
    },
  ];
  system.stars.forEach((s: Star) => {
    starChildren.push({
      label: s.name,
      value: `star-${s.name}`,
      icon: 'material-symbols:sunny',
      defaultExpanded: true,
      children: [
        {
          label: `Spectral Class: ${s.spectralClass}`,
          value: `${s.name}-sc`,
          icon: 'material-symbols:cards-star-outline',
        },
        {
          label: `Temperature: ${s.temperature} K`,
          value: `${s.name}-temp`,
          icon: 'uil:temperature-half',
        },
        {
          label: `Mass: ${s.mass} SM`,
          value: `${s.name}-mass`,
          icon: 'gravity-ui:weight-hanging',
        },
        {
          label: `Radius: ${s.radius} SR`,
          value: `${s.name}-rad`,
          icon: 'oui:radius',
        },
      ],
    });
  });

  return [
    {
      label: system.name,
      value: 'system',
      icon: 'game-icons:orbital',
      defaultExpanded: true,
      children: starChildren,
    },
  ];
}

const items = ref(createItems(props.system));

watch(props, () => {
  items.value = createItems(props.system);
});
</script>

<template>
  <div>
    <p v-if="!isSystemSelected">Click on a system to select it...</p>
    <UTree v-if="isSystemSelected" :items />
  </div>
</template>
