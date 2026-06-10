<script setup lang="ts">
import { Search, Bell } from 'lucide-vue-next';
</script>

<template>
  <header class="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 flex justify-center items-center h-16">
    <div class="w-full max-w-xl flex justify-between items-center px-4">
      <button class="text-gray-400 hover:text-white transition-colors active:scale-95 duration-200">
        <Search class="w-6 h-6" />
      </button>
      <h1 class="text-2xl font-black text-red-600 italic font-headline-md tracking-tight">DRAMAFLIX</h1>
      <button class="text-gray-400 hover:text-white transition-colors active:scale-95 duration-200">
        <Bell class="w-6 h-6" />
      </button>
    </div>
  </header>
</template>
