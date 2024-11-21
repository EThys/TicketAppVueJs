<script setup lang="ts">
import Header from './Header.vue'
</script>

<template>
    <div class="flex-1 flex flex-col ">
      <Header />

      <main class="flex-1  w-full">
        <div class=" h-screen w-screen">
          <slot />
        </div>
      </main>
    </div>
</template>