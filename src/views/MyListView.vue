<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TopHeader from '@/components/TopHeader.vue';
import { PlayCircle, BookmarkX } from 'lucide-vue-next';

const { t } = useI18n();

const continueWatching = [
  { id: 1, title: "The Contract Wife", current: 12, total: 80, progress: 15, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcitdMV76wN9S3v7VgGwqZlP3zue0B6meOVFqJbsceFcsHbsU09MsndXT0weATf3GJZOQbqwvgdn2OLThWCf0QftLBi4a0AJAW5SILsx-CBLs4hpLbJJga6CKRty3PZUJlZbQou9uXc8ovtiNbJGqPj3kBeYte19sz4V8ORA6cbSjm4A8N9DAxV-8jQ3pqMQwMhZVsyBqFnlJTIClWSxtL3xpYMvs3UAs1Pzf-j5xqrcbnWsL-veiFsUvgoG8fGlVBysvJntlnIbU" },
  { id: 2, title: "Hidden Heir", current: 45, total: 50, progress: 90, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhd7eizjO1QPxLCfaWEMJlGxRoDAx9Tn9NQ1ATwLZYwrgLgdDjC1kyJNypzTY0c4r7t-lIvni1rBNDV8RT7vwtjhOXVpfYotYnE10KNiWRsV96kmlbmbEYxQdjrDQSt0by32ov7FykCEw81itnZq5o1mcv6KHtHDWNLvPyqnIweDr1e9YRht4cQzz1SdcpF5CNPnV_m93Z7kY4fmiabGLlKm1k4uA_nmNDe03ST6f23_863Zhcrbio0TrsxMSLGxedG0oWwfe76Lk" },
];

const savedItems = [
  { id: 1, title: "Billionaire's Secret", isNew: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6fzF2kuErOX_Cra873X4WKVyU6lnt8eY1yNTXUPdV_mGsehurdAdORCNebTzu40CoMFs6y507nhlL7EL7WKxjJjyRuENwCJMJWSM5nlMBF_p-bLpQCFmpn6N6sMJSNKUtSyiKIrw5CvxEKQkf2q12nEX_m6_aK53FcblN4MqczSxKLrr9qk7ypb2UOF-Qd7iauPtPyV4UNJY4gd7uBLDuHyMDKg1wgSImg57f3PC4kmXXIJmfBQFvqqZf4PVQ-o2lqo0pbTJiujE" },
  { id: 2, title: "Runaway Bride", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBraihI1n3VjiGrheXHAiqcUl-gkNCoi5OJTuy7wJ0lT6CK9cAwOYTo4syzuevg4Ii_mvBInLJxaL7Uppi8UtR2pOITFmg5BTEHJH2r3pkLAI_l7f9btTiG1ayIOn9QhkWOL0MJtYu8QYldLKwiU-d_7AJnfcwvPmyytpDSqovarDTVI9oGZLBgGgyH8UeCz7FlCJ6DxvSM_5FoETnuRmYaMRGKcopULF6bFucPo0rKrzKXKfdABYOHcbKKlmSpz1FyU-aeHmoR0g" },
  { id: 3, title: "House of Cards", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaA2MiG5K9Wnv1WU1fahvom6_oGolKTdiAf3lmnhNy9SU9RxtocNtJYOeEUfTSgr0P4b906KlNWhrBb6ISNwi05kwruoIM5SrLm23lTvQvz9oW892P-rvcHH2xZVj1Dpbm_Cq1vxZY3HDIqNyapFaXjv2tz-_6KU5ZXWjhYJhfrLvuZd-jkeKcuDJW9gs2FLtLgWwq6hSkyzeC4-a7E3RPfnH94jGketHmXxWlmBj2VxRJvV9urE3AtMNZ3pAQJGfC6pZYf4JpeXM" },
  { id: 4, title: "The Agreement", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP-qYYSvtWbmJkLKkCwOi3Y2eEUfwmZIi4YhGQgBBpKAwC8mBJdnUqY2nY9YXIJtvil1ZanKH7mLMbNr8_7QZs9LOqm2iaUyAWgJRdksnM9mw4zNoU-D93J2uUUpS-1x1gv-jA6IK-_QsAUOh1Y_PfXT_n0CMKDCu_1DYZ56YKl436u3J5V8n91zSqFLVIgxgsCATboCiPjm3nhvh4iBJjZr0QrjrxRNeVNJmoqsTYkv-mG83X0421vgQUcE1dNoLcsIK2f1Ohuc0" },
];
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <TopHeader />
    
    <main class="pt-[80px] pb-[100px] px-4 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <!-- Recently Watched Section -->
      <section>
        <h2 class="font-headline-md text-headline-md text-on-background mb-2">Continue Watching</h2>
        <div class="flex overflow-x-auto gap-2 hide-scrollbar snap-x pb-2 -mx-4 px-4 md:grid md:grid-cols-4 md:snap-none md:overflow-visible">
          <div v-for="item in continueWatching" :key="item.id" 
            @click="$router.push(`/player/${item.id}`)"
            class="relative flex-shrink-0 w-[140px] md:w-full aspect-[3/4] rounded-lg overflow-hidden bg-surface-container snap-start group cursor-pointer border border-white/5 shadow-md hover:shadow-primary-container/20 transition-all">
            <img :src="item.img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 card-scrim flex flex-col justify-end p-1">
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                <PlayCircle class="w-12 h-12 text-on-background drop-shadow-lg fill-white/20" />
              </div>
              <div class="relative z-10 mb-1">
                <h6 class="text-lg text-on-background truncate">{{ item.title }}</h6>
                <p class=" text-sm text-on-surface-variant">Ep. {{ item.current }} / {{ item.total }}</p>
              </div>
            </div>
            <!-- Progress Bar -->
            <div class="absolute bottom-0 left-0 w-full h-[4px] bg-surface-container-highest">
              <div class="h-full bg-primary-container" :style="{ width: item.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Saved for Later Grid -->
      <section>
        <div class="flex justify-between items-end mb-2">
          <h2 class="font-headline-md text-headline-md text-on-background">Saved for Later</h2>
          <button class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Edit List</button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div v-for="item in savedItems" :key="item.id" 
            @click="$router.push(`/series/${item.id}`)"
            class="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface-container cursor-pointer border border-white/5 group shadow-lg">
            <img :src="item.img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <button @click.stop class="absolute top-xs right-xs w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-on-background hover:bg-surface-container-high transition-colors z-20">
              <BookmarkX class="w-5 h-5" />
            </button>
            <div class="absolute inset-0 card-scrim flex flex-col justify-end p-2">
              <div v-if="item.isNew" class="flex items-center gap-1 mb-1">
                <span class="px-2 py-[2px] rounded bg-primary-container text-on-primary-container font-label-sm text-[10px] uppercase font-bold tracking-wider">New</span>
              </div>
              <h3 class="font-label-lg text-label-lg text-on-background leading-tight">{{ item.title }}</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
