import produce from 'immer'
import { CombinedState, CombinedStateOperations, createEmptyCombinedState } from './CombinedState'

let state: CombinedState = createEmptyCombinedState()
let initialState = state

beforeEach(() => initialState = state = createEmptyCombinedState())

describe('direct', () => {
  it('should update first object only', () => {
    const operations = new CombinedStateOperations(mutate => mutate(state))
    operations.first.setX(3)
    expect(initialState.first.x).toBe(3)
    expect(initialState.first).toBe(state.first)
    expect(state.first.x).toBe(3)
    expect(state.second.x).toBe(2)
    expect(state.second).toBe(initialState.second)
    expect(initialState).toBe(state)
  })
})

describe('immer', () => {
  it('should update first object only', () => {
    const operations = new CombinedStateOperations(mutate => state = produce(state, mutate))
    operations.first.setX(3)
    expect(initialState.first.x).toBe(1)
    expect(initialState.first).not.toBe(state.first)
    expect(state.first.x).toBe(3)
    expect(state.second.x).toBe(2)
    expect(state.second).toBe(initialState.second)
    expect(initialState).not.toBe(state)
  })
})
