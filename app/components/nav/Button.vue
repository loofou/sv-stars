<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: '#',
  },
});
</script>

<template>
  <a :href class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
    <Icon :name="icon" class="mx-1" /> <slot />
  </a>
</template>
