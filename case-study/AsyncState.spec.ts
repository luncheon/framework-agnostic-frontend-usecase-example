import { AsyncState, createEmptyAsyncState, AsyncOperations } from './AsyncState'
import * as jestFetchMock from 'jest-fetch-mock'
import produce from 'immer'

const fetchMock: jestFetchMock.FetchMock = jestFetchMock as any
global.fetch = fetchMock
beforeEach(() => fetchMock.resetMocks())

const url = 'dummy url'
let state: AsyncState = createEmptyAsyncState(url)
let initialState = state

beforeEach(() => initialState = state = createEmptyAsyncState(url))

describe('direct', () => {
  it('should update state asynchronously', async () => {
    fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve({ body: '{"success":1}' }), 100)))
    const operations = new AsyncOperations(mutate => mutate(state))
    expect(state).toEqual({ url, loading: false })
    expect(fetchMock).toBeCalledTimes(0)
    const promise = operations.load()
    expect(fetchMock).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith(url)
    expect(state).toEqual({ url, loading: true })
    await promise
    expect(state).toEqual({ url, loading: false, value: { success: 1 } })
  })
})

describe('immer', () => {
  it('should update state asynchronously', async () => {
    fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve({ body: '{"success":1}' }), 100)))
    const operations = new AsyncOperations(mutate => state = produce(state, mutate))
    expect(state).toEqual({ url, loading: false })
    expect(state).toBe(initialState)
    expect(fetchMock).toBeCalledTimes(0)
    const promise = operations.load()
    expect(fetchMock).toBeCalledTimes(1)
    expect(fetchMock).toBeCalledWith(url)
    expect(state).not.toBe(initialState)
    expect(initialState).toEqual({ url, loading: false })
    expect(state).toEqual({ url, loading: true })
    await promise
    expect(initialState).toEqual({ url, loading: false })
    expect(state).toEqual({ url, loading: false, value: { success: 1 } })
  })
})
