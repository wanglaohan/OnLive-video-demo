<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import BottomNav from '@/components/BottomNav.vue'
import { useAuth } from '@/composables/useAuth'
import { preloadHls } from '@/composables/useHls'

const { silentLogin } = useAuth()

onMounted(() => {
  console.info('[App] mounted')
  silentLogin()
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      preloadHls().then(() => console.info('[App] hls.js preloaded'))
    })
  } else {
    setTimeout(() => {
      preloadHls().then(() => console.info('[App] hls.js preloaded'))
    }, 3000)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-background font-body-md antialiased overflow-hidden flex flex-col relative select-none">
    <RouterView />
    <BottomNav v-if="!$route.meta.hideNav" />
  </div>
</template>

<style>
/* Hide scrollbar for clean UI */
::-webkit-scrollbar { display: none; }
.mask-fade-top { mask-image: linear-gradient(to bottom, transparent, black 20%); }

.pt-safe { padding-top: env(safe-area-inset-top, 24px); }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 24px); }

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.card-scrim {
    background: linear-gradient(to top, rgba(14, 14, 14, 0.9) 0%, rgba(14, 14, 14, 0.4) 40%, transparent 100%);
}
</style>
