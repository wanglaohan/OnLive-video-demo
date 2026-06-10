<script setup lang="ts">
import { useDebugStore } from '@/stores/debug'
import { useAuthStore } from '@/stores/auth'
import { ChevronLeft, Trash2, Bug } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'

const debugStore = useDebugStore()
const authStore = useAuthStore()
const container = ref<HTMLElement | null>(null)
const filter = ref<'all' | 'log' | 'warn' | 'error' | 'info'>('all')

const filteredLogs = computed(() => {
  if (filter.value === 'all') return debugStore.logs
  return debugStore.logs.filter(l => l.type === filter.value)
})

watch(
  () => debugStore.logs.length,
  async () => {
    await nextTick()
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight
    }
  }
)

const typeColor = (t: string) => ({ warn: 'text-yellow-400', error: 'text-red-400', info: 'text-blue-400' }[t] || 'text-gray-300')
const typeLabel = (t: string) => ({ warn: 'WARN', error: 'ERR ', info: 'INFO' }[t] || 'LOG ')
</script>

<template>
  <div class="h-screen bg-[#1e1e1e] text-gray-300 font-mono text-[13px] flex flex-col overflow-hidden">
    <header class="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3c3c3c] shrink-0">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3c3c3c] transition-colors">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <Bug class="w-4 h-4 text-green-400" />
        <span class="text-gray-200 font-semibold">Dev Console</span>
        <span class="text-[11px] text-gray-500 ml-1">{{ debugStore.logs.length }} entries</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex rounded overflow-hidden border border-[#3c3c3c]">
          <button
            v-for="f in (['all','log','info','warn','error'] as const)"
            :key="f"
            @click="filter = f"
            class="px-2.5 py-1 text-[11px] uppercase font-semibold transition-colors"
            :class="filter === f ? 'bg-[#094771] text-white' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#3c3c3c]'"
          >{{ f === 'all' ? 'All' : f }}</button>
        </div>
        <button @click="debugStore.clear()" class="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-[#3c3c3c] transition-colors">
          <Trash2 class="w-4 h-4" />
        </button>
      </div>
    </header>

    <div ref="container" class="flex-1 overflow-y-auto p-4 space-y-0.5">
      <div v-if="filteredLogs.length === 0" class="text-gray-600 italic mt-4">
        No logs yet.
      </div>
      <div
        v-for="entry in filteredLogs"
        :key="entry.id"
        class="flex gap-3 py-0.5 hover:bg-white/[0.04] px-1 rounded"
      >
        <span class="text-gray-500 shrink-0 w-[140px]">{{ entry.timestamp }}</span>
        <span class="shrink-0 w-10 font-bold" :class="typeColor(entry.type)">{{ typeLabel(entry.type) }}</span>
        <span class="break-all">{{ entry.message }}</span>
      </div>
    </div>

    <footer class="px-4 py-3 bg-[#252526] border-t border-[#3c3c3c] shrink-0 flex items-center justify-between text-[11px] text-gray-500">
      <div class="flex items-center gap-4">
        <span>openId: <span class="text-gray-300">{{ authStore.openId || '—' }}</span></span>
        <span>loggedIn: <span :class="authStore.isLoggedIn ? 'text-green-400' : 'text-gray-500'">{{ authStore.isLoggedIn }}</span></span>
      </div>
      <span v-if="authStore.error" class="text-red-400">last error: {{ authStore.error }}</span>
    </footer>
  </div>
</template>
