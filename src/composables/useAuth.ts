/*
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-05-03 00:42:54
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-03 21:50:57
 * @FilePath: \onLiveVideo\src\composables\useAuth.ts
 */
import { useAuthStore } from '@/stores/auth'

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://tiktok-drama-nest-backend.wangmoumou001.workers.dev'

let silentLoginPromise: Promise<void> | null = null

const LOGIN_TIMEOUT_MS = 5000

export function useAuth() {
  const authStore = useAuthStore()

  function login(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error('TTMinis.login timeout'))
      }, LOGIN_TIMEOUT_MS)

      if (!window.TTMinis?.login) {
        window.clearTimeout(timer)
        reject(new Error('TTMinis SDK not ready'))
        return
      }

      window.TTMinis.login(function (res: any) {
        window.clearTimeout(timer)
        if (res.error) {
          reject(new Error(res.error))
          return
        }
        const code = res.authResponse?.code
        if (!code) {
          reject(new Error('TTMinis.login missing auth code'))
          return
        }
        resolve(code)
      })
    })
  }

  async function silentLogin() {
    if (authStore.isLoggedIn) return
    if (silentLoginPromise) return silentLoginPromise

    silentLoginPromise = doSilentLogin().finally(() => {
      silentLoginPromise = null
    })

    return silentLoginPromise
  }

  async function doSilentLogin() {
    console.info('[Auth] Silent login started')
    authStore.setLoading(true)

    try {
      console.log('[Auth] Calling TTMinis.login() ...')
      const code = await login()
      console.log(`[Auth] code: ${code}`)

      const response = await fetch(`${API_BASE}/api/auth/minis-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const text = await response.text()
      console.info(`[Auth] response: ${text}`)

      if (!response.ok) throw new Error(`Backend auth failed: ${response.status} -- ${text}`)

      const data = JSON.parse(text)
      const token = data.access_token || ''
      const user = data.user || {}
      authStore.setAuth(token, {
        openId: user.open_id || '',
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        isPaid: user.is_paid || false,
        maxEpisode: user.max_episode || 0,
      })
      console.info(`[Auth] openId: ${user.open_id}, nickname: ${user.nickname}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown login error'
      authStore.setError(msg)
      console.error(`[Auth] ${msg}`)
    } finally {
      authStore.setLoading(false)
    }
  }

  return { silentLogin }
}
