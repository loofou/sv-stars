<template>
  <div class="flex h-screen bg-gray-100">
    <NavBar>
      <NavButton icon="uil:home" href="/"> Home </NavButton>
      <NavButton icon="uil:star" href="/zone"> Neighbourhood </NavButton>
    </NavBar>
    <NavContainer>
      <div class="flex grow">
        <ScSystemCanvas />
      </div>
    </NavContainer>
  </div>
</template>
