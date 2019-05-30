export interface AsyncState {
  url: string
  loading: boolean
  value?: any
  error?: any
}

export class AsyncOperations {
  constructor(private readonly update: (mutate: (state: AsyncState) => void) => unknown) {}

  async load() {
    let url: string | undefined
    this.update(state => {
      if (state.loading) {
        throw Error('loading yet.')
      }
      url = state.url
      state.loading = true
      state.value = undefined
      state.error = undefined
    })

    try {
      if (!url) {
        throw Error('url is not specified.')
      }
      const response = await fetch(url)
      const value = await response.json()
      this.update(state => {
        state.loading = false
        if (response.ok) {
          state.value = value
        } else {
          state.error = { status: response.status, value }
        }
      })
    } catch (error) {
      this.update(state => {
        state.loading = false
        state.error = error
      })
    }
  }
}

export const createEmptyAsyncState = (url: string): AsyncState => ({ url, loading: false })
