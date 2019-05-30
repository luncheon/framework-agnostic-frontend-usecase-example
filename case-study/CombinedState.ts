export type Update<T> = (mutate: (state: T) => void) => unknown


export interface FirstState {
  x: number
}

export class FirstStateOperations {
  constructor(private readonly update: Update<FirstState>) {}

  setX(x: number) {
    this.update(state => { state.x = x })
  }
}

const createEmptyFirstOperations = (): FirstState => ({ x: 1 })


export interface SecondState {
  x: number
}

export class SecondStateOperations {
  constructor(private readonly update: Update<SecondState>) {}

  setX(x: number) {
    this.update(state => { state.x = x })
  }
}

const createEmptySecondOperations = (): SecondState => ({ x: 2 })


export interface CombinedState {
  first: FirstState
  second: SecondState
}

export class CombinedStateOperations {
  readonly first = new FirstStateOperations(mutate => this.update(state => mutate(state.first)))
  readonly second = new SecondStateOperations(mutate => this.update(state => mutate(state.second)))

  constructor(private readonly update: Update<CombinedState>) {}
}

export const createEmptyCombinedState = (): CombinedState => ({
  first: createEmptyFirstOperations(),
  second: createEmptySecondOperations(),
})
