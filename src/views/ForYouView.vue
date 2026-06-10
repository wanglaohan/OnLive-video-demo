<!--
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-04-29 23:20:50
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-05 20:08:29
 * @FilePath: \onLiveVideo\src\views\ForYouView.vue
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n';
import TopHeader from '@/components/TopHeader.vue';
import { Play, Plus, Share2 } from 'lucide-vue-next';

const { t } = useI18n();
const cardHeight = ref('calc(100vh - 160px)')

function updateCardHeight() {
  cardHeight.value = `${window.innerHeight - 160}px`
}

onMounted(() => {
  updateCardHeight()
  window.addEventListener('resize', updateCardHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCardHeight)
})

const feedItems = [
  {
    id: 1,
    title: "The Billionaire's Secret Vow",
    description: "He offered her a contract to save her family, but neither expected the dangerous game of love and betrayal that followed in the city's elite circles.",
    tags: ['CEO', 'Romance', 'Revenge'],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC7ad3BxdA5g9CFmr8Lti5UJpZTDnGCl8w5JjQSijxVgdbiHBV7JzpTYXc1DBAO2yr6eTScaIK6MZdM-Qb_hY_13efup1WP_j5SbEuD3AdMCdk3Vt2RLPQHhq1VE6PxuQKjsDmeUNXk8s3zeCtRxTiGOt3q6EM5pr0K1eJFMPawQFTuWgxcX6QRL2Gnxqtk1Wbtc1S-SbcUi_EJdI7rDQ5OZA_Ju6hnalm0I5HkznP-gYCrcDqd8hw8-HSGiw21FCtUwPeqT1Adn4"
  },
  {
    id: 2,
    title: "Shadows of Neon",
    description: "When her sister vanishes into the city's underground street racing scene, she must navigate a world where speed is currency and trust is a myth.",
    tags: ['Urban', 'Thriller'],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6yI4cjORsJT7adZ3j61FNbd_6saQ4kaib-CJp8H2Dt4iGW-qxp-Hj4FXlzziDWsimWx2nHH3DLFYdAaVGqjB6znkeDv55IOYMcXrKWv0ogVkLuyNHLmPQ23aJw9wtUyMakCOBvlmuCbhtjg-dOGCtEqN3sbYMnpDv6M9XStMGSBSE4wZ7hCNR0Qi996Mb2ypHuGH4uUXtsdBUw4Ro5p_O2X4gf-PErihBhHP0tayiH8VSYCj9rV50FWXGCzL0hlDzIWWbRQ3HES8"
  }
];
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden pt-16">
    <TopHeader />
    
    <main class="flex-1 overflow-y-scroll snap-y snap-mandatory bg-background pb-20">
      <article v-for="item in feedItems" :key="item.id" 
        class="relative shrink-0 snap-start bg-surface m-4 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.01] group"
        :style="{ height: cardHeight }">
        
        <img :src="item.img" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
        
        <div class="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-background/95"></div>
        
        <div class="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-3 z-10">
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in item.tags" :key="tag" 
              class="bg-surface/50 backdrop-blur-md text-on-surface font-label-sm text-label-sm px-3 py-[2px] rounded-sm border border-white/10 uppercase font-medium">
              {{ tag }}
            </span>
          </div>
          
          <h2 class="font-headline-xl text-headline-xl text-on-background drop-shadow-md leading-tight">{{ item.title }}</h2>
          <p class="font-body-md text-body-md text-on-surface-variant line-clamp-2 opacity-90">
            {{ item.description }}
          </p>
          
          <div class="mt-3 flex items-center justify-between">
            <button @click="$router.push(`/player/${item.id}`)" class="bg-inverse-primary text-white rounded-full flex items-center gap-2 px-5 py-3 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(191,0,35,0.4)] active:scale-95 group/btn">
              <Play class="w-5 h-5 fill-current group-hover/btn:scale-110 transition-transform" />
              <span class="font-label-lg text-label-lg uppercase tracking-wider">{{ t('common.playNow') }}</span>
            </button>
            <div class="flex gap-3">
              <button class="text-on-surface hover:text-primary transition-colors flex flex-col items-center gap-1 active:scale-90 p-2">
                <Plus class="w-6 h-6" />
              </button>
              <button class="text-on-surface hover:text-primary transition-colors flex flex-col items-center gap-1 active:scale-90 p-2">
                <Share2 class="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>
