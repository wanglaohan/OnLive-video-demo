<!--
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-04-29 23:20:50
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-03 22:51:57
 * @FilePath: \onLiveVideo\src\views\SeriesDetailView.vue
-->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, Heart, Play, Lock, ChevronDown } from 'lucide-vue-next'
import { dramaMap } from '@/data/dramas'
import { preloadHls } from '@/composables/useHls'

const { t } = useI18n()
const route = useRoute()

const dramaId = computed(() => route.params.id as string)
const drama = computed(() => dramaMap.get(dramaId.value))

const episodes = computed(() =>
  Array.from({ length: drama.value?.episodeCount || 0 }, (_, i) => ({
    id: i + 1,
    isFree: i === 0,
    isLocked: i > 0,
  }))
)

onMounted(() => {
  preloadHls().then(() => console.info('[SeriesDetail] hls.js preloaded'))
})
</script>

<template>
  <div class="bg-surface text-on-surface font-body-md antialiased min-h-screen pb-32">
    <template v-if="drama">
    <!-- Floating Top Nav -->
    <header class="fixed top-0 left-0 w-full z-50 pt-safe px-edge_margin py-4 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-surface-container-low/50 backdrop-blur-md flex items-center justify-center text-on-surface border border-white/5 pointer-events-auto active:scale-95 transition-transform">
        <ChevronLeft class="w-6 h-6 mr-1" />
      </button>
      <button class="w-10 h-10 rounded-full bg-surface-container-low/50 backdrop-blur-md flex items-center justify-center text-on-surface border border-white/5 pointer-events-auto active:scale-95 transition-transform">
        <Heart class="w-5 h-5 fill-primary text-primary" />
      </button>
    </header>

    <!-- Hero Background -->
    <div class="relative w-full h-[500px] bg-surface-container-lowest">
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" :style="`background-image: url('${drama.img}')`">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent"></div>
      <div class="absolute inset-0 flex items-center justify-center opacity-60">
        <div class="w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center pl-1">
          <Play class="w-8 h-8 fill-current" />
        </div>
      </div>
    </div>

    <!-- Content area -->
    <main class="relative z-10 px-edge_margin -mt-32 pb-20 max-w-4xl mx-auto w-full">
      <div class="flex flex-col gap-2 mb-6">
        <h1 class="font-headline-xl text-headline-xl text-on-surface drop-shadow-md">{{ drama.title }}</h1>
        <div class="flex flex-wrap items-center gap-1">
          <span v-if="drama.tag" class="px-2 py-1 rounded-sm bg-surface-container border border-white/5 font-label-sm text-label-sm text-primary uppercase font-bold">{{ drama.tag }}</span>
          <span v-for="tag in drama.tags" :key="tag" class="px-2 py-1 rounded-sm bg-surface-container border border-white/5 font-label-sm text-label-sm text-on-surface-variant">{{ tag }}</span>
          <span class="px-2 py-1 rounded-sm bg-surface-container-high border border-white/10 font-label-sm text-label-sm text-on-surface">{{ drama.episodes }}</span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3 mt-1 leading-relaxed max-w-2xl">
          {{ drama.description }}
        </p>
      </div>

      <!-- Episodes Grid -->
      <section class="mt-8">
        <div class="flex justify-between items-end mb-2">
          <h2 class="font-headline-md text-headline-md text-on-surface">Episodes</h2>
          <span class="font-label-sm text-label-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors">Select All</span>
        </div>
        
        <div class="grid grid-cols-5 md:grid-cols-10 gap-3">
          <button v-for="ep in episodes" :key="ep.id" 
            @click="$router.push(`/player/${ep.id}?drama=${drama.id}`)"
            class="relative w-full aspect-square rounded-md bg-surface-container border flex items-center justify-center group active:scale-95 transition-all shadow-sm hover:shadow-primary/20"
            :class="[ep.isFree ? 'border-primary-container/60 shadow-[inset_0_0_15px_rgba(255,83,86,0.1)]' : 'border-white/5 bg-surface-container-low hover:bg-surface-container']">
            <span class="font-label-lg text-label-lg transition-all" :class="[ep.isFree ? 'text-primary scale-110 font-bold' : 'text-on-surface-variant opacity-70 group-hover:opacity-100']">{{ ep.id }}</span>
            <div v-if="ep.isFree" class="absolute top-0 right-0 bg-primary-container px-1.5 py-0.5 rounded-bl-md font-label-sm text-[8px] leading-none text-on-primary-container font-bold tracking-wider">FREE</div>
            <Lock v-if="ep.isLocked" class="absolute top-1 right-1 w-3 h-3 text-on-surface-variant opacity-40 shrink-0" />
          </button>
        </div>
        
        <button class="w-full mt-6 py-4 rounded-lg bg-surface-container flex items-center justify-center gap-2 border border-white/5 text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-all active:scale-[0.99] shadow-md">
          Show All {{ drama.episodes }}
          <ChevronDown class="w-5 h-5" />
        </button>
      </section>
    </main>

    <!-- Sticky Bottom -->
    <div class="fixed bottom-1 left-0 w-full z-40 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent pt-8 pb-safe px-edge_margin flex justify-center">
      <div class="w-full max-w-xl ">
        <button @click="$router.push(`/player/1?drama=${drama.id}`)" class="w-full bg-primary-container text-on-primary-container py-4 rounded-xl flex items-center justify-center gap-3 font-headline-md text-headline-md shadow-[0_4px_24px_rgba(255,83,86,0.25)] active:scale-95 transition-all hover:brightness-110">
          <Play class="w-6 h-6 fill-current" />
          Watch Episode 1
        </button>
      </div>
    </div>
    </template>

    <div v-else class="flex items-center justify-center min-h-screen text-on-surface-variant">
      Drama not found
    </div>
  </div>
</template>
