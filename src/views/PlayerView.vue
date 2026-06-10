<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, Heart, MessageCircle, Share2, Plus, Lock, CircleDollarSign, ChevronUp, ChevronDown, Play, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { dramaMap } from '@/data/dramas'
import type Hls from 'hls.js'
import { preloadHls } from '@/composables/useHls'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { silentLogin } = useAuth()

const dramaName = computed(() => (route.query.drama as string) || 'drama1')
const drama = computed(() => dramaMap.get(dramaName.value))
const currentEpisode = computed(() => Number(route.params.id) || 1)
const totalEpisodes = computed(() => drama.value?.episodeCount || 0)
const hasPrev = computed(() => currentEpisode.value > 1)
const hasNext = computed(() => currentEpisode.value < totalEpisodes.value)
const selectedQuality = computed(() => (route.query.quality as string) || 'auto')
const qualityPickerOpen = ref(false)
const qualityOptions = ['auto', '360p','480p', '720p'] as const

function selectQuality(q: string) {
  qualityPickerOpen.value = false
  const qs = { ...route.query }
  if (q === 'auto') {
    delete qs.quality
  } else {
    qs.quality = q
  }
  router.replace({ query: qs })
}

const queryAccessToken = computed(() => (route.query.accessToken as string) || (route.query.token as string) || '')

const videoUrl = ref('')
const previewDuration = ref(0)
const isLoading = ref(true)
const error = ref('')
const isVideoReady = ref(false)
const currentTime = ref(0)
const progress = ref(0)

const videoRef = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null
let timeUpdateTimer: number | null = null

const episodeCache = new Map<number, VideoPlayResponse>()
let prefetchPromise: Promise<void> | null = null

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://tiktok-drama-nest-backend.wangmoumou001.workers.dev'

interface VideoPlayResponse {
  videoUrl?: string
  episode?: number
  previewDuration?: number
}

function getStoredAccessToken() {
  try {
    return (
      window.localStorage.getItem('accessToken') ||
      window.localStorage.getItem('token') ||
      window.localStorage.getItem('jwt') ||
      ''
    )
  } catch {
    return ''
  }
}

function getAccessToken() {
  if (authStore.accessToken) return authStore.accessToken
  if (queryAccessToken.value) {
    authStore.setAccessToken(queryAccessToken.value)
    return queryAccessToken.value
  }
  const storedAccessToken = getStoredAccessToken()
  if (storedAccessToken) {
    authStore.setAccessToken(storedAccessToken)
    return storedAccessToken
  }
  return ''
}

async function prefetchEpisode(ep: number) {
  if (episodeCache.has(ep)) return
  if (prefetchPromise) return
  const accessToken = getAccessToken()
  if (!accessToken) return

  prefetchPromise = (async () => {
    try {
      const params = new URLSearchParams({
        episode: String(ep),
        dramaName: dramaName.value,
        token: accessToken,
      })
      if (selectedQuality.value !== 'auto') {
        params.set('quality', selectedQuality.value)
      }
      const res = await fetch(`${API_BASE}/api/video/play?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) return
      const data = (await res.json()) as VideoPlayResponse
      if (data.videoUrl) {
        episodeCache.set(ep, data)
        console.info(`[Player] prefetched episode ${ep}`)
      }
    } catch { /* silent */ }
    finally { prefetchPromise = null }
  })()

  return prefetchPromise
}

async function fetchVideo() {
  isLoading.value = true
  error.value = ''
  isVideoReady.value = false
  destroyHls()

  try {
    const cached = episodeCache.get(currentEpisode.value)
    if (cached?.videoUrl) {
      episodeCache.delete(currentEpisode.value)
      videoUrl.value = cached.videoUrl
      previewDuration.value = cached.previewDuration ?? 0
      console.log(`[Player] using cached videoUrl for episode ${currentEpisode.value}`)
      await nextTick()
      await initHls()
      return
    }

    let accessToken = getAccessToken()
    if (!accessToken) {
      await silentLogin()
      accessToken = getAccessToken()
    }
    if (!accessToken) {
      throw new Error('未登录或 accessToken 不存在')
    }

    const params = new URLSearchParams({
      episode: String(currentEpisode.value),
      dramaName: dramaName.value,
      token: accessToken,
    })
    if (selectedQuality.value !== 'auto') {
      params.set('quality', selectedQuality.value)
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    }

    const playApiUrl = `${API_BASE}/api/video/play?${params.toString()}`
    const logParams = new URLSearchParams(params)
    logParams.set('token', '***')
    console.info(`[Player] fetching ${API_BASE}/api/video/play?${logParams.toString()} with accessToken`)
    const res = await fetch(playApiUrl, { headers })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Video API failed: ${res.status} -- ${text}`)
    }
    const data = (await res.json()) as VideoPlayResponse
    if (!data.videoUrl) {
      throw new Error('Video API response missing videoUrl')
    }

    videoUrl.value = data.videoUrl
    previewDuration.value = data.previewDuration ?? 0
    console.log(
      `[Player] videoUrl: ${data.videoUrl}, episode: ${data.episode}, quality: ${selectedQuality.value}, previewDuration: ${previewDuration.value}s`,
    )
    await nextTick()
    await initHls()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    error.value = msg
    console.error(`[Player] ${msg}`)
    isLoading.value = false
  }
}

async function initHls() {
  destroyHls()
  if (!videoRef.value || !videoUrl.value) return

  const Hls = await preloadHls()

  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
    })
    hls.loadSource(videoUrl.value)
    hls.attachMedia(videoRef.value)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      isLoading.value = false
      isVideoReady.value = true
      videoRef.value?.play().catch(() => {})
    })
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        console.error('[Player] HLS fatal:', data)
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls?.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls?.recoverMediaError()
            break
          default:
            error.value = 'Video playback error'
            isLoading.value = false
            break
        }
      }
    })
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = videoUrl.value
    videoRef.value.addEventListener('loadedmetadata', () => {
      isLoading.value = false
      isVideoReady.value = true
      videoRef.value?.play().catch(() => {})
    })
  } else {
    error.value = 'HLS not supported on this device'
    isLoading.value = false
  }
}

function destroyHls() {
  if (hls) {
    hls.destroy()
    hls = null
  }
}

function onTimeUpdate() {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  const dur = videoRef.value.duration
  if (dur && dur > 0) {
    progress.value = (currentTime.value / dur) * 100
    if (progress.value >= 80 && hasNext.value) {
      prefetchEpisode(currentEpisode.value + 1)
    }
    if (progress.value <= 20 && hasPrev.value) {
      prefetchEpisode(currentEpisode.value - 1)
    }
  }
}

function seekVideo(value: number) {
  if (!videoRef.value) return
  const dur = videoRef.value.duration
  if (!dur || dur <= 0) return
  const targetTime = (value / 100) * dur
  videoRef.value.currentTime = targetTime
  currentTime.value = targetTime
  progress.value = value
}

function goEpisode(ep: number) {
  if (ep < 1 || ep > totalEpisodes.value) return
  router.replace({
    path: `/player/${ep}`,
    query: {
      drama: dramaName.value,
      ...(selectedQuality.value !== 'auto' ? { quality: selectedQuality.value } : {}),
    },
  })
}

const swipeDirection = ref('')
const swipeOffset = ref(0)
const isVerticalSwipe = ref(false)

let touchStartY = 0
let touchStartX = 0
const DEAD_ZONE = 10
const SWIPE_THRESHOLD = 60

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
  touchStartX = e.touches[0].clientX
  swipeDirection.value = ''
  swipeOffset.value = 0
  isVerticalSwipe.value = false
}

function onTouchMove(e: TouchEvent) {
  const dy = e.touches[0].clientY - touchStartY
  const dx = e.touches[0].clientX - touchStartX
  if (Math.abs(dx) > Math.abs(dy)) return
  if (Math.abs(dy) < DEAD_ZONE) return
  if (!isVerticalSwipe.value && Math.abs(dy) >= DEAD_ZONE) {
    isVerticalSwipe.value = true
  }
  e.preventDefault()
  swipeDirection.value = dy > 0 ? 'down' : 'up'
  swipeOffset.value = dy
}

function onTouchEnd() {
  if (Math.abs(swipeOffset.value) < SWIPE_THRESHOLD) {
    swipeDirection.value = ''
    swipeOffset.value = 0
    return
  }
  if (swipeDirection.value === 'up' && hasNext.value) {
    goEpisode(currentEpisode.value + 1)
  } else if (swipeDirection.value === 'down' && hasPrev.value) {
    goEpisode(currentEpisode.value - 1)
  }
  swipeDirection.value = ''
  swipeOffset.value = 0
}

const commentsPreview = [
  { user: 'drama_queen', text: "Omg I can't believe he said that! 😱", img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EYyNUy73MLg_M9ahAsmmUaFOz88W2PVBVjxLk1AXyzXG5lE4tsjYeCG6zGgq5mfIaTqJbEBj3DSJW6SIGZ0qnKHPP996hFTauyskMHXU-QEHyCoY1FaQ9kd39EnXxfj4_6PV3dPaNBb7O9tH_pAyct1dyLfNaD_fOL0IrEGLttJGnD2Sc7-Guieb_nm6NDd4A6ST-QYCIdlhqrMcjCUovtQX1ibpS20frb4LLCeqPtLKSKNtJnpduFGtDZRqY79ss8VU7miCgb0' },
  { user: 'user9921', text: "Next episode NOW please!!!", img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp0NfvrUpmAqQATpR5L2oBpbt5sj4QbqMyajb8VswTgPY_o4SsziDt4xUAm5ApX4WpDYbor5tah-KyzcU_19r92V7frtjpCQLUUhUyFEZQf4eyKnWmv5Vss6l95ALeVxvXN-DPcEy5hk2Qo02SKJO2YWPWfGFBmrSvy-Tf4TIlBrbTjzTanFuIaiD_GgYZXSO4M4xucklTOWQi2LOhaWsba4S5cha6hIxmwPg89P5nXYIbQdbIoErRPXZYwIK8CutDSq6MRq2uuPM' }
]

onMounted(() => {
  fetchVideo()
  timeUpdateTimer = window.setInterval(onTimeUpdate, 500)
})

watch([currentEpisode, dramaName, selectedQuality], () => {
  fetchVideo()
})

onUnmounted(() => {
  destroyHls()
  if (timeUpdateTimer) clearInterval(timeUpdateTimer)
})
</script>

<template>
  <div
    class="h-screen w-full overflow-hidden flex flex-col relative bg-black select-none"
    style="touch-action: pan-y"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Video Player -->
    <div class="absolute inset-0 w-full h-full z-0 flex items-center justify-center bg-black">
      <video
        ref="videoRef"
        class="w-full h-full object-contain"
        playsinline
        webkit-playsinline
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
      />

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-white/20 border-t-primary-container rounded-full animate-spin" />
          <span class="font-label-md text-sm text-on-surface-variant">{{ t('common.loading') || 'Loading...' }}</span>
        </div>
      </div>

      <!-- Error Overlay -->
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
        <div class="flex flex-col items-center gap-4 px-8 text-center">
          <AlertCircle class="w-12 h-12 text-red-400" />
          <p class="font-label-lg text-on-surface">{{ error }}</p>
          <button @click="fetchVideo" class="px-6 py-3 bg-primary-container text-on-primary-container rounded-xl font-label-md active:scale-95 transition-transform">
            Retry
          </button>
        </div>
      </div>

      <!-- Scrims -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-[20%] pointer-events-none"></div>
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent h-[60%] pointer-events-none"></div>
    </div>

    <!-- Header -->
    <header class="fixed top-0 left-0 w-full z-50 pt-safe px-edge_margin py-4 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-surface-container-low/50 backdrop-blur-md flex items-center justify-center text-on-surface border border-white/5 pointer-events-auto active:scale-95 transition-transform">
        <ChevronLeft class="w-6 h-6 mr-1" />
      </button>
      <div class="relative pointer-events-auto">
        <button
          @click="qualityPickerOpen = !qualityPickerOpen"
          class="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 uppercase font-headline-md text-xs text-on-surface flex items-center gap-1 active:scale-95 transition-transform"
        >
          {{ selectedQuality === 'auto' ? 'Auto' : selectedQuality }}
          <ChevronDown
            class="w-3 h-3 transition-transform duration-200"
            :class="{ 'rotate-180': qualityPickerOpen }"
          />
        </button>
        <Transition name="fade">
          <div
            v-if="qualityPickerOpen"
            class="fixed inset-0 z-50"
            @click="qualityPickerOpen = false"
          />
        </Transition>
        <Transition name="fade">
          <div
            v-if="qualityPickerOpen"
            class="absolute top-full right-0 mt-2 rounded-xl bg-surface-container-low/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden min-w-[80px] z-[60]"
          >
            <button
              v-for="q in qualityOptions"
              :key="q"
              @click="selectQuality(q)"
              class="w-full px-4 py-2.5 text-xs text-on-surface hover:bg-white/10 transition-colors text-center"
              :class="{ 'text-primary font-semibold': selectedQuality === q }"
            >
              {{ q === 'auto' ? 'Auto' : q }}
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <!-- Play/Pause center overlay (tap) -->
    <div
      v-if="isVideoReady"
      class="absolute inset-0 z-10 flex items-center justify-center"
      @click="videoRef?.paused ? videoRef.play() : videoRef.pause()"
    >
      <Transition name="fade">
        <div v-if="videoRef?.paused" class="w-16 h-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center pl-1">
          <Play class="w-8 h-8 fill-current text-white" />
        </div>
      </Transition>
    </div>

    <!-- Right Side Actions -->
    <div class="absolute right-edge_margin md:right-[calc(50%-280px)] bottom-[25%] flex flex-col items-center gap-6 z-20">
      <button class="flex flex-col items-center gap-1 group">
        <div class="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-primary shadow-lg group-active:scale-90 transition-transform">
          <Heart class="w-7 h-7 fill-current" />
        </div>
        <span class="font-label-sm text-[11px] text-on-surface drop-shadow-md">342k</span>
      </button>
      
      <button class="flex flex-col items-center gap-1 group">
        <div class="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-on-surface shadow-lg group-active:scale-90 transition-transform">
          <MessageCircle class="w-7 h-7" />
        </div>
        <span class="font-label-sm text-[11px] text-on-surface drop-shadow-md">12.5k</span>
      </button>

      <button class="flex flex-col items-center gap-1 group">
        <div class="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/5 flex items-center justify-center text-on-surface shadow-lg group-active:scale-90 transition-transform">
          <Share2 class="w-7 h-7" />
        </div>
        <span class="font-label-sm text-[11px] text-on-surface drop-shadow-md">Share</span>
      </button>

      <button class="flex flex-col items-center gap-1 group mt-2">
        <div class="w-12 h-12 rounded-full bg-surface-container-high/80 border border-white/10 flex items-center justify-center text-on-surface shadow-lg overflow-hidden relative">
          <Plus class="w-6 h-6 z-10" />
        </div>
        <span class="font-label-sm text-[10px] text-on-surface-variant drop-shadow-md">My List</span>
      </button>
    </div>


    <!-- Swipe Transition Hint -->
    <Transition name="swipe-toast">
      <div v-if="swipeDirection" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div class="flex flex-col items-center gap-1 bg-black/70 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10">
          <ChevronUp v-if="swipeDirection === 'up'" class="w-8 h-8 text-on-surface animate-bounce" />
          <ChevronDown v-if="swipeDirection === 'down'" class="w-8 h-8 text-on-surface animate-bounce" />
          <span class="font-label-sm text-xs text-on-surface-variant">
            {{ swipeDirection === 'up' ? (hasNext ? `Episode ${currentEpisode + 1}` : t('player.lastEpisode')) : (hasPrev ? `Episode ${currentEpisode - 1}` : t('player.firstEpisode')) }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- Bottom Controls -->
    <div class="absolute bottom-0 left-0 w-full flex justify-center z-20">
      <div class="w-full max-w-xl px-edge_margin pb-safe pt-12 flex flex-col">
        <div class="mb-6 pr-[80px]">
          <div class="flex items-center gap-1 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">{{ t('player.original') }}</span>
            <span class="font-label-sm text-label-sm text-primary drop-shadow-md">Episode {{ currentEpisode }}</span>
          </div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface drop-shadow-lg mb-1 leading-tight">{{ drama?.title || 'Drama' }}</h1>
          <p class="font-body-md text-body-md text-on-surface-variant drop-shadow-md line-clamp-1">{{ drama?.description || '' }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full mb-4">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            :value="progress"
            @input="seekVideo(Number(($event.target as HTMLInputElement).value))"
            class="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer range-slider"
          />
        </div>

        <!-- Episode Nav + Unlock -->
        <div class="flex items-center gap-3">
          <button
            @click="goEpisode(currentEpisode - 1)"
            :disabled="!hasPrev"
            class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-on-surface transition-all active:scale-90 shrink-0"
            :class="hasPrev ? 'hover:bg-white/20' : 'opacity-20'"
          >
            <ChevronUp class="w-5 h-5" />
          </button>
          <!-- <button class="flex-1 py-[14px] bg-primary-container hover:brightness-110 text-on-primary-container rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xl">
            <Lock class="w-5 h-5" />
            <span class="font-label-lg text-label-lg uppercase tracking-wide">{{ t('player.unlock') }}</span>
            <span class="font-label-sm text-label-sm opacity-80 border-l border-on-primary-container/30 pl-2 ml-1 flex items-center gap-1">
              <CircleDollarSign class="w-4 h-4" /> 20
            </span>
          </button> -->
          <button
            @click="goEpisode(currentEpisode + 1)"
            :disabled="!hasNext"
            class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-on-surface transition-all active:scale-90 shrink-0"
            :class="hasNext ? 'hover:bg-white/20' : 'opacity-20'"
          >
            <ChevronDown class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swipe-toast-enter-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
.swipe-toast-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}
.swipe-toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
.swipe-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(1.1);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
