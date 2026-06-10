<!--
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-04-29 23:20:50
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-02 20:52:14
 * @FilePath: \onLiveVideo\src\components\BottomNav.vue
-->
<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Home, Compass, Library, User } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full flex justify-center items-center  pb-safe bg-black/80 backdrop-blur-2xl border-t border-white/5 shadow-[0_-4px_20px_rgba(255,30,57,0.1)] rounded-t-lg z-50">
    <div class="w-full max-w-xl flex justify-around items-center py-6">
      <RouterLink to="/" class="flex flex-col items-center justify-center transition-all duration-200 w-16" :class="[$route.name === 'home' ? 'text-red-600 scale-110' : 'text-gray-500 hover:text-red-400']">
        <Home class="w-6 h-6 mb-1" :stroke-width="$route.name === 'home' ? 3 : 2" />
        <span class="text-[10px] font-headline-md font-semibold uppercase tracking-widest">{{ t('nav.home') }}</span>
      </RouterLink>

      <RouterLink to="/for-you" class="flex flex-col items-center justify-center transition-all duration-200 w-16" :class="[$route.name === 'for-you' ? 'text-red-600 scale-110' : 'text-gray-500 hover:text-red-400']">
        <Compass class="w-6 h-6 mb-1" :stroke-width="$route.name === 'for-you' ? 3 : 2" />
        <span class="text-[10px] font-headline-md font-semibold uppercase tracking-widest">{{ t('nav.forYou') }}</span>
      </RouterLink>

      <RouterLink to="/my-list" class="flex flex-col items-center justify-center transition-all duration-200 w-16" :class="[$route.name === 'my-list' ? 'text-red-600 scale-110' : 'text-gray-500 hover:text-red-400']">
        <Library class="w-6 h-6 mb-1" :stroke-width="$route.name === 'my-list' ? 3 : 2" />
        <span class="text-[10px] font-headline-md font-semibold uppercase tracking-widest">{{ t('nav.myList') }}</span>
      </RouterLink>

      <RouterLink to="/profile" class="flex flex-col items-center justify-center transition-all duration-200 w-16" :class="[$route.name === 'profile' ? 'text-red-600 scale-110' : 'text-gray-500 hover:text-red-400']">
        <User class="w-6 h-6 mb-1" :stroke-width="$route.name === 'profile' ? 3 : 2" />
        <span class="text-[10px] font-headline-md font-semibold uppercase tracking-widest">{{ t('nav.profile') }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
</style>
