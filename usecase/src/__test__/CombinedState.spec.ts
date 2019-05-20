import produce from 'immer'

type Update<T> = (mutate: (state: T) => void) => unknown

interface FirstState {
  x: number
}

class FirstStateOperations {
  constructor(private readonly update: Update<FirstState>) {}

  setX(x: number) {
    this.update(state => { state.x = x })
  }
}


interface SecondState {
  x: number
}

class SecondStateOperations {
  constructor(private readonly update: Update<SecondState>) {}

  setX(x: number) {
    this.update(state => { state.x = x })
  }
}


interface CombinedState {
  first: FirstState
  second: SecondState
}

class CombinedStateOperations {
  readonly first = new FirstStateOperations(mutate => this.update(state => mutate(state.first)))
  readonly second = new SecondStateOperations(mutate => this.update(state => mutate(state.second)))

  constructor(private readonly update: Update<CombinedState>) {}
}


const createEmptyCombinedState = () => ({ first: { x: 1 }, second: { x: 2 } })
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
