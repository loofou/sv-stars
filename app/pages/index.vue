<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <NavButton icon="uil:home" href="/">
        Home
      </NavButton>
    </NavBar>
    <NavContainer>
      <div class="flex grow">
        <ScCanvas />
      </div>
    </NavContainer>
  </div>
</template>
