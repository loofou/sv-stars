<template>
  <div class="hidden md:flex flex-col w-64 bg-gray-800">
    <NavHeader title="State Vector RPG" subtitle="Star Catalog" />
    <NavMenu>
      <NavButton icon="uil:home" href="/">
        Home
      </NavButton>
      <NavButton icon="uil:star" href="/stars">
        Start
      </NavButton>
    </NavMenu>
    <SvFooter />
  </div>
</template>