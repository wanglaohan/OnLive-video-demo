import type Hls from 'hls.js'

let HlsClass: typeof Hls | null = null
let hlsPreloadPromise: Promise<typeof Hls> | null = null

export function preloadHls(): Promise<typeof Hls> {
  if (HlsClass) return Promise.resolve(HlsClass)
  if (hlsPreloadPromise) return hlsPreloadPromise
  hlsPreloadPromise = import('hls.js').then(m => {
    HlsClass = m.default
    return HlsClass
  })
  return hlsPreloadPromise
}
