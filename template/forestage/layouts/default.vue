<template>
  <div>
    <div class="relative flex min-h-screen w-full flex-col">
      <Navbar class="lg:justify-between" />
      <div class="flex w-full flex-1 flex-col">
        <div class="max-w-8xl relative mx-auto flex h-full w-full flex-1 flex-col">
          <slot />
        </div>
      </div>
      <slot name="footer">
        <Footer />
      </slot>
    </div>
  </div>
</template>
