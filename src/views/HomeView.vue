<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TopHeader from '@/components/TopHeader.vue';
import { Play, Plus } from 'lucide-vue-next';
import { dramas as originals } from '@/data/dramas';

const { t } = useI18n();

const tabs = ['popular', 'original', 'female', 'male', 'revenge'];

const trendingShorts = [
  { id: 1, title: "Contract Marriage Escape", views: "800K Views", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDytIu78_50pyQughiRTKaf2xbUNa0KmnKLhjwyHL4vuYoYfNeBCc9rAHSnVJ8noi-l9AdbhyugtFb8L3aMGouK9DgjO7QHjEPPjYYtN89dnC9uvosx4qvt8Yf7ZS3QqA2rW1usJNCy-dcMYXex3-Aep-l6m44Cxh5w08eMVTy6TZnet8gMMDLGlZD-orAuBpt4wo0cRd17FaqFaj_sNQa6q3GLxbe1mRbS1VmtvPImr8bWB6jwAPFaZLBKCsaGxxCBObAvZCIXrtc", color: "#ff5356" },
  { id: 2, title: "Maid to the Mafia", views: "650K Views", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkeZHABM1irDGdPHpbpVWM7CR6MjufNGJy3-KvqXz-K0EVu5cxJWTqeLBZXzJZ1OV2We3AFSUgrItZvJiueUIzx94GV6vUDZavuaamzurZH4YDjTipyH-cnaPV_j50ajWNqmOK1IUb0jZ-09Chq98-a5YmLU176QLUW4kOkLvFiaXTUH41gyGrqV7NzGMRTceEKwh6hp1IUXRBtJZ3MNs-EFofBrAIWSE_-nsRM2a50im-qviBY05Iy3OE32q-PwPyi-KsXHn018M", color: "#c8c6c6" },
];
</script>

<template>
  <div class="flex-1 overflow-y-auto pb-32">
    <TopHeader />
    
    <!-- Top Navigation Tabs -->
    <nav class="fixed top-16 w-full px-2 z-40 bg-surface/90 backdrop-blur-md border-b border-surface-variant flex justify-center py-3 no-scrollbar font-label-lg text-label-lg">
      <div class="w-full max-w-xl flex overflow-x-auto gap-6 px-edge_margin no-scrollbar">
        <button v-for="tab in tabs" :key="tab" 
          class="whitespace-nowrap transition-colors pb-1"
          :class="[tab === 'popular' ? 'text-primary-container border-b-2 border-primary-container' : 'text-on-surface-variant hover:text-on-surface']">
          {{ t(`home.${tab}`) }}
        </button>
      </div>
    </nav>

    <main class="mt-[112px] flex flex-col gap-5 max-w-4xl mx-auto w-full">
      <!-- Hero Featured Drama -->
      <section class="relative w-full aspect-[4/5] md:aspect-video bg-surface-container-highest overflow-hidden">
        <img
          class="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEZfpCgDfMCs_qJ5vfYdJ_NEJ1snmJQK95Hkdl-RlBzqW1H9f8Hw6T_6A43Cmi60yF1Iqno6tHo_JD66r78uE_zWUkhBSYSOL51DKlzA8-w83EgBlU1k1ldQ46JBdqr_u8TC_4l9xTR3GJMJ1v_K-jpXsR71CWgh-D6pXvm9VEhuZfUclS8pM4lAXCmtdQXO0m46yRC0-U7FdFObDN_gWjox4NLUM3cXhkhafyoBE8QzeuRvUPTgMsmFVqjLRklMw012I0v-007jM"
          fetchpriority="high"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full px-2 p-edge_margin flex flex-col items-start gap-4">
          <div class="flex gap-2">
            <span class="px-2 py-1 bg-primary-container text-on-primary-container font-label-sm text-label-sm rounded uppercase tracking-wider">New Episode</span>
            <span class="px-2 py-1 bg-surface-container-high/80 backdrop-blur text-on-surface font-label-sm text-label-sm rounded">Romance</span>
          </div>
          <h2 class="font-headline-xl text-headline-xl text-on-surface drop-shadow-md leading-tight">My Secret Agent<br/>Husband</h2>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-sm line-clamp-2">He thought he married a simple florist. She thought he married a boring accountant. Both are the city's deadliest assassins.</p>
          <div class="flex gap-3 mt-2 w-full max-w-sm">
            <button @click="$router.push('/player/1')" class="flex-1 bg-primary-container text-on-primary-container font-label-lg text-label-lg py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95 shadow-lg">
              <Play class="w-5 h-5 fill-current" />
              {{ t('common.playNow') }}
            </button>
            <button class="p-3 bg-surface-container-high/80 backdrop-blur text-on-surface rounded-lg hover:bg-surface-variant transition-colors active:scale-95">
              <Plus class="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      <!-- Exclusive Originals -->
      <section class="flex flex-col gap-4 px-2">
        <div class="px-edge_margin flex justify-between items-end">
          <h3 class="font-headline-lg text-headline-lg text-on-surface">{{ t('home.exclusive') }}</h3>
          <button class="font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors">{{ t('home.viewAll') }}</button>
        </div>
        <div class="flex overflow-x-auto gap-4 px-edge_margin snap-x no-scrollbar pb-4">
          <div v-for="item in originals" :key="item.id" 
            @click="$router.push(`/series/${item.id}`)"
            class="snap-start shrink-0 w-[140px] flex flex-col gap-2 group cursor-pointer">
            <div class="relative aspect-[3/4] rounded-lg overflow-hidden border border-outline-variant/30">
              <img :src="item.img" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-if="item.tag" class="absolute top-2 left-2 px-1.5 py-0.5 bg-error text-on-error font-label-sm text-[10px] rounded font-bold">{{ item.tag }}</div>
            </div>
            <h4 class="font-label-lg text-label-lg text-on-surface truncate">{{ item.title }}</h4>
            <p class="font-body-md text-[12px] text-on-surface-variant truncate">Drama • {{ item.episodes }}</p>
          </div>
        </div>
      </section>

      <!-- Trending Now -->
      <section class="flex flex-col gap-4 mb-8 px-2">
        <div class="px-edge_margin">
          <h3 class="font-headline-lg text-headline-lg text-on-surface">{{ t('home.trending') }}</h3>
        </div>
        <div class="flex overflow-x-auto gap-6 px-edge_margin snap-x no-scrollbar pb-4 pl-8">
          <div v-for="(item, idx) in trendingShorts" :key="item.id" 
            class="snap-start shrink-0 w-[320px] h-[140px] relative rounded-xl bg-surface-container-high border border-outline-variant/20 flex group cursor-pointer shadow-md">
            <div class="absolute w-14 text-center  top-1/2 -translate-y-1/2 font-headline-xl text-[64px] font-black text-background"
              :style="{ '-webkit-text-stroke': `2px ${item.color}` }">
              {{ idx + 1 }}
            </div>
            <img :src="item.img" loading="lazy" decoding="async" class="w-1/3 h-full object-cover rounded-l-xl ml-14" />
            <div class="flex-1 p-3 flex flex-col justify-center">
              <h4 class="font-label-lg text-label-lg text-on-surface line-clamp-2 mb-1">{{ item.title }}</h4>
              <p class="font-body-md text-[12px] text-on-surface-variant">{{ item.views }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
