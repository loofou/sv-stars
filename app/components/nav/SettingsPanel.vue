<script lang="ts" setup>
import { useSettings } from '~/composables/useSettings';

//Settings
const settings = useSettings();
</script>

<template>
  <UCollapsible class="flex flex-col gap-2">
    <UButton label="Settings" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-down" block />
    <template #content>
      <div class="p-3 rounded-md border border-solid border-gray-600">
        <USwitch class="p-1" label="Show Bloom" v-model="settings.showBloom" />
        <USwitch class="p-1" label="Show Grid" v-model="settings.showGrid" />
        <USwitch class="p-1" label="Show Background Stars" v-model="settings.showBgStars" />
        <USwitch class="p-1" label="Show Dwarf Stars" v-model="settings.showDwarfStars" />
      </div>
    </template>
  </UCollapsible>
</template>
