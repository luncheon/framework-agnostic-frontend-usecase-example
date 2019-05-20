# フレームワークにとらわれない状態変更ロジックの実装例です。

（**状態の持ち方にとらわれない状態変更ロジック**と言った方がより適切かもしれません。）

Angular, React.PureComponent, React.Component, Vue.js, Redux, rxjs, MobX など、利用するフレームワークによって状態の持ち方や監視方法が異なりますが、少なくとも**状態変更ロジックはフレームワークにとらわれない書き方ができる**と考えます。

このリポジトリはそのサンプル実装です。ひとつの状態変更ロジックを異なる複数のフレームワークで使い回して、それぞれ同一の挙動をするアプリを作成しています。

* [Angular (rxjs + immer)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/angular-app/)
* [React (useState() + immer)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/react-app/)
* [Vue.js (Vue.observable)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/vuejs-app/)）

状態オブジェクトのイミュータビリティを抽象化するために immer を利用しています。

* [immerjs/immer: Create the next immutable state by mutating the current one](https://github.com/immerjs/immer)


## 背景

ブログ記事を参照してください。

* [[Web フロントエンド] 状態更新ロジックをフレームワークから独立させる | Kabuku Developers Blog](https://www.kabuku.co.jp/developers/framework-agnostic-state-modification)


## 解説

### はじめに

（コードはシンプルなはずですが、解説が読みづらいせいで難解に感じるかもしれません。すみません。）

スプレッドシートを扱うアプリで、アクティブセルを更新する処理を例にしています。

まずはこの例で扱う状態オブジェクトの型定義を紹介しておきます。

[usecase/src/Worksheet.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/usecase/src/Worksheet.ts)

```typescript
export interface Worksheet {
  readonly maxCellAddress: Readonly<WorksheetCellAddress>
  activeCellAddress: WorksheetCellAddress
}

export interface WorksheetCellAddress {
  rowIndex: number
  columnIndex: number
}
```

### 状態変更ロジック

* 状態変更ロジックを記述するクラスは「状態を変更するロジック（関数）を受け取って実際の更新処理を行う関数 `update: (mutate: (state: Worksheet) => void) => unknown`」を受け取ります（状態の更新処理を抽象化します）。
* 状態の変更メソッドでは前述の「実際の更新処理を行う関数 `update()`」に「オブジェクトの変更ロジック」を渡します `update(state => state.xxx.yyy = zzz)`。
* このクラスは状態そのものを保持しません。状態の持ち方を利用側の自由にするためです。

[usecase/src/WorksheetOperations.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/usecase/src/WorksheetOperations.ts)

```typescript
export class WorksheetOperations {
  constructor(private readonly update: (mutate: (state: Worksheet) => void) => unknown) {}

  setActiveCellAddress(rowIndex?: number, columnIndex?: number): this {
    this.update(({ maxCellAddress, activeCellAddress }) => {
      if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex <= maxCellAddress.rowIndex) {
        activeCellAddress.rowIndex = rowIndex
      }
      if (typeof columnIndex === 'number' && columnIndex >= 0 && columnIndex <= maxCellAddress.columnIndex) {
        activeCellAddress.columnIndex = columnIndex
      }
    })
    return this
  }
}
```

### Vue.js で利用する場合

* Vue.js のように、状態オブジェクトがミュータブルな前提で使えるフレームワークでは、 `update()` 関数として単純に `mutate => mutate(state)` を渡します。
  * `state.xxx.yyy = zzz` のような普通の変更処理が実行されて、フレームワークが勝手に（Vue.js 2.x なら setter, 3.x なら proxy を介して）反応します。

[apps/vuejs-app/src/components/AppWorksheet.vue](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/vuejs-app/src/components/AppWorksheet.vue)

```typescript
export default Vue.component(filename, {
  data() {
    const worksheet = Vue.observable(createWorksheet())
    const worksheetOperations = new WorksheetOperations(
      mutate => mutate(worksheet)
    )
    return { worksheet, worksheetOperations }
  }
}
```

### React.PureComponent （あるいは React.memo() されたコンポーネント）の props に利用する場合

* 状態オブジェクトがイミュータブルな前提で使う際には、 `update()` 関数として immer の `produce()` 関数を介した `mutate => setState(state => produce(state, mutate))` のような関数を渡します。
  * `produce(state, state => state.xxx.yyy = zzz)` が新しいオブジェクトを生成してくれるので、返ってきたオブジェクトを保持するだけです。
* `produce(state, mutate)` は `produce(mutate)(state)` とも記述できるので、 React では `mutate => setState(state => produce(state, mutate))` の代わりに `mutate => setState(produce(mutate))` と記述できます。

[apps/react-app/src/Worksheet.tsx](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/react-app/src/Worksheet.tsx)

```typescript
import produce from 'immer'

export default () => {
  const [state, setState] = React.useState(createWorksheet())
  const worksheetOperations = new WorksheetOperations(
    mutate => setState(produce(mutate))
  )
  return (
    <WorksheetTableMemoized
      worksheet={state}
      worksheetOperations={worksheetOperations}
    />
  )
}
```

### Angular (rxjs) で利用する場合

* 状態を rxjs の `BehaviorSubject` として持つ場合も、状態をイミュータブルとして扱うので、 React 同様 immer を介します。

[apps/angular-app/src/app/worksheet.services.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/angular-app/src/app/worksheet.services.ts)

```typescript
import produce from 'immer'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class WorksheetService {
  private readonly _worksheet = new BehaviorSubject<Worksheet>(createWorksheet())
  readonly worksheetOperations = new WorksheetOperations(
    mutate => this._worksheet.next(produce(this._worksheet.value, mutate))
  )
}
```

* 以上いずれのフレームワークでも、 `worksheetOperations.setActiveCellAddress(rowIndx, columnIndex)` を呼ぶことで状態が更新（変更または生成）されて画面に反映されます。


## おとしあな・制限

* immer の制限
  * 状態ツリーは循環参照を持てません。
  * 状態ツリーの中に同じオブジェクトへの参照が複数ある場合でも、同じオブジェクトへの参照としては扱われません。
  * [詳細は immer の README を参照してください。](https://github.com/immerjs/immer#pitfalls)
* Vue.js の制限
  * Vue.js 2.x は配列要素の差し替え `array[index] = value` に対してリアクティブではありません
    * [リストレンダリング — Vue.js #注意事項](https://jp.vuejs.org/v2/guide/list.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A0%85)
    * これについて私はとりあえず Vue.js 3.x を待ちます。
  * Vue.js で扱うデータは immer に渡せません。
    * [Why can't drafts have computed properties? · Issue #317 · immerjs/immer](https://github.com/immerjs/immer/issues/317)
    * Vue.js 3.x でもダメかもしれませんが、おそらく immer を介す理由がなくなります。


## スケールアップ： 状態オブジェクトの統合

複数の状態を統合したくなったら、次の `CombinedState`／`CombinedStateOperation` のような形でシンプルに実現できます。

[usecase/src/\_\_test\_\_/CombinedState.spec.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/usecase/src/__test__/CombinedState.spec.ts)

```typescript
type Update<T> = (mutate: (state: T) => void) => unknown
```

```typescript
interface CombinedState {
  first: FirstState
  second: SecondState
}

class CombinedStateOperation {
  readonly first = new FirstStateOperation(mutate => this.update(state => mutate(state.first)))
  readonly second = new SecondStateOperation(mutate => this.update(state => mutate(state.second)))

  constructor(private readonly update: Update<CombinedState>) {}
}
```

```typescript
interface FirstState {
  x: number
}

class FirstStateOperation {
  constructor(private readonly update: Update<FirstState>) {}

  setX(x: number) {
    this.update(state => { state.x = x })
  }
}
```

```typescript
interface SecondState {
  /* ... */
}

class SecondStateOperation {
  constructor(private readonly update: Update<SecondState>) {}

  /* ... */
}
```
