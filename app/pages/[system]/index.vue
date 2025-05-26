<script lang="ts" setup>
const route = useRoute();

const system: string = route.params.system as string;

useHead({
  title: `State Vector Star Catalog - ${system}`,
});

//Settings
const settings = useSettings();
const canvasKey = ref(0);

watch(
  () => settings.value.showBgStars,
  () => {
    //resetSelections();
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
    </NavBar>
    <NavContainer>
      <div class="grow">
        <ScSystemCanvas :key="canvasKey" :system />
      </div>
    </NavContainer>
  </div>
</template>
