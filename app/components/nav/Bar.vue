<template>
  <div class="flex flex-col w-64 bg-gray-800">
    <NavHeader title="State Vector RPG" subtitle="Star Catalog" />
    <NavMenu>
      <slot />
    </NavMenu>
    <NavFooter />
  </div>
</template>
