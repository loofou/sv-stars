<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-16 py-3 bg-gray-900">
    <span class="text-white flex-1 font-bold uppercase">{{ title }}</span>
    <span class="text-white flex-1">{{ subtitle }}</span>
  </div>
</template>
