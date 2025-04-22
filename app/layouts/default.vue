<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar />
    <SvContainer>
      <slot />
      <SvFooter />
    </SvContainer>
  </div>
</template>