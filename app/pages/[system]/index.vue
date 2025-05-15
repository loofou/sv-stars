<script lang="ts" setup>
const route = useRoute();

const system: string = route.params.system as string;

useHead({
  title: `State Vector Star Catalog - ${system}`,
});

const systems = useCatalog();
const canvasKey = ref(0);

const thisSystem = computed(() => {
  return systems.state.value.find((s: System) => s.name === system) ?? new System();
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <NavSettingsPanel />
      <USeparator :label="system" class="my-2 font-extrabold" />
      <UButton class="m-2 self-center" icon="mdi:arrow-top-left-thin" variant="subtle">
        <NuxtLink to="/"> Back to Neighbourhood </NuxtLink>
      </UButton>
    </NavBar>
    <NavContainer>
      <div class="grow">
        <ScSystemCanvas :key="canvasKey" :system />
      </div>
    </NavContainer>
  </div>
</template>
