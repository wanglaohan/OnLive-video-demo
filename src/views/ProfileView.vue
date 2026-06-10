<!--
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-04-29 23:20:50
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-05 15:33:59
 * @FilePath: \onLiveVideo\src\views\ProfileView.vue
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import TopHeader from '@/components/TopHeader.vue';
import { Mail, Star, CircleDollarSign, PlusCircle, ReceiptText, History, Headphones, Settings, LogOut, ChevronRight } from 'lucide-vue-next';

const { t } = useI18n();
const authStore = useAuthStore();

const menuItems = [
  { icon: ReceiptText, label: 'My Orders' },
  { icon: History, label: 'Watch History' },
  { icon: Headphones, label: 'Customer Support' },
  { icon: Settings, label: 'Settings' },
];
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <TopHeader />
    
    <main class="pt-20 px-edge_margin max-w-md mx-auto pb-32">
      <!-- User Profile Header -->
      <section class="flex flex-col items-center mt-8 mb-8">
        <div class="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary-container to-surface-container border border-surface-container-highest shadow-xl">
          <img class="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNts4sJkV0X1EXFfmnYADlubI6zNfj26713V_E0O9o5tfgMBXCNvNWRT95Rf8dMdH__ih7Z-VqT4LpmmDDyCdASB4bhfv2Fsr2V-jGghAzkF-ZywEPJFvQ2StkYUS3DB1gIuhEcrjGijD7cfxHKY2ZoO31c7jQRfEWzTokglfqXe_dvxh2snn8vU1Q57Jt-pNrV8vpL5dNNdy48OmoTEhB4VvIpHy4iMCPm0-EbP-H6L4qa6aN9yGRq7AiEAxUEkYzk9HWVRQM-F4" />
          <!-- VIP Badge -->
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-surface-container-highest border border-outline-variant px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star class="w-3 h-3 text-primary fill-current" />
            <span class="text-[10px] font-label-sm font-bold text-on-surface tracking-wider uppercase">VIP</span>
          </div>
        </div>
        <h2 class="mt-6 text-headline-xl font-headline-xl text-on-surface">{{ authStore.nickname || 'User' }}</h2>
        <p class="mt-1 text-body-md font-body-md text-on-surface-variant flex items-center gap-1">
          <Mail class="w-4 h-4" />
          {{ authStore.openId ? `ID: ${authStore.openId.slice(0, 8)}...` : 'Not logged in' }}
        </p>
      </section>

      <!-- Wallet Section -->
      <section class="mb-8">
        <div class="relative overflow-hidden bg-surface-container rounded-xl p-6 border border-white/5 shadow-2xl">
          <div class="absolute -top-12 -right-12 w-40 h-40 bg-primary-container/20 rounded-full blur-[40px] pointer-events-none"></div>
          <div class="relative z-10 flex flex-col gap-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest mb-2">My Wallet</h3>
                <div class="flex items-baseline gap-2">
                  <CircleDollarSign class="w-8 h-8 text-primary-container" />
                  <span class="text-headline-xl font-headline-xl text-on-surface tracking-tight">4,250</span>
                </div>
                <p class="text-body-md font-body-md text-on-surface-variant mt-1">Available Coins</p>
              </div>
              <button class="bg-primary-container text-on-primary-container font-label-lg text-label-lg px-5 py-2.5 rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                Top Up
                <PlusCircle class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Options Menu -->
      <section class="flex flex-col gap-4 mb-8">
        <button v-for="item in menuItems" :key="item.label" 
          class="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container rounded-lg border border-transparent hover:border-white/5 transition-all group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface group-hover:text-primary-container group-hover:bg-primary-container/10 transition-colors">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <span class="text-body-lg font-body-lg text-on-surface">{{ item.label }}</span>
          </div>
          <ChevronRight class="w-5 h-5 text-on-surface-variant group-hover:text-on-surface transition-colors" />
        </button>
      </section>

      <!-- Log Out -->
      <div class="px-2">
        <button class="w-full py-4 text-error font-label-lg text-label-lg rounded-lg border border-error/20 hover:bg-error/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <LogOut class="w-5 h-5" />
          Log Out
        </button>
      </div>
    </main>
  </div>
</template>
