<template>
  <div class="flex h-screen bg-gray-100">
    <SvNavbar />
    <SvContainer>
      <slot />
      <SvFooter />
    </SvContainer>
  </div>
</template>