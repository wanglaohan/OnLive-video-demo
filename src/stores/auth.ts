import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  openId: string
  nickname: string
  avatar: string
  isPaid: boolean
  maxEpisode: number
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const openId = ref('')
  const nickname = ref('')
  const avatar = ref('')
  const isPaid = ref(false)
  const maxEpisode = ref(0)
  const isLoggedIn = ref(false)
  const isLoading = ref(false)
  const error = ref('')

  function setAuth(token: string, user: UserInfo) {
    accessToken.value = token
    openId.value = user.openId
    nickname.value = user.nickname
    avatar.value = user.avatar
    isPaid.value = user.isPaid
    maxEpisode.value = user.maxEpisode
    isLoggedIn.value = true
    error.value = ''
  }

  function setAccessToken(token: string) {
    accessToken.value = token
    isLoggedIn.value = true
    error.value = ''
  }

  function setLoading(val: boolean) {
    isLoading.value = val
  }

  function setError(msg: string) {
    error.value = msg
    isLoggedIn.value = false
  }

  function clearAuth() {
    accessToken.value = ''
    openId.value = ''
    nickname.value = ''
    avatar.value = ''
    isPaid.value = false
    maxEpisode.value = 0
    isLoggedIn.value = false
    error.value = ''
  }

  return {
    accessToken,
    openId,
    nickname,
    avatar,
    isPaid,
    maxEpisode,
    isLoggedIn,
    isLoading,
    error,
    setAuth,
    setAccessToken,
    setLoading,
    setError,
    clearAuth,
  }
})
