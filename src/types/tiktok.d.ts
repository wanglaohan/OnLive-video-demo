interface TTMinisLoginResult {
  error?: string
  authResponse?: {
    code: string
  }
}

interface TTMinisInstance {
  init(config: { clientKey: string }): void
  login(callback: (res: TTMinisLoginResult) => void): void
}

interface Window {
  TTMinis: TTMinisInstance
  __ttMinisReady: boolean
}
