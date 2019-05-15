# フレームワークによらない状態変更ロジックの実装例です。

**状態の持ち方によらない状態変更ロジック**と言った方がより適切かもしれません。

Angular, React.PureComponent, React.Component, Vue.js, Redux, rxjs, MobX など、利用するフレームワークによって状態の持ち方や監視方法が異なりますが、状態変更ロジックはこれらフレームワークによらない書き方ができるはずです。

この考えを現実にしてくれるのが [immer](https://github.com/immerjs/immer) です。

immer を使うのはロジックの利用側であって、ロジック側は immer を使いません。  
ただし、状態ツリー内に循環参照を含められらないなど immer に制限があるので、 immer を介して利用されることを想定しておく必要はあります。

このリポジトリでは、単一の状態変更ロジックを複数の異なる状態管理方法で使い回して、それぞれ同一の挙動をするアプリを作成しています。

* [Angular (rxjs + immer)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/angular-app/)
* [React (useState() + immer)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/react-app/)
* [Vue.js (Vue.observable)](https://luncheon.github.io/framework-agnostic-frontend-usecase-example/vuejs-app/)）


## 解説

* まずはこの例で扱う状態オブジェクトの型を紹介しておきます。  
（ただの表です。この例自体はおもしろいものではありません。あしからず。）

```typescript
export interface Worksheet {
  readonly maxCellAddress: Readonly<WorksheetCellAddress>
  activeCellAddress: WorksheetCellAddress
  cellContents: string[][]  // cellContents[rowIndex]?.[columnIndex]: string
}

export interface WorksheetCellAddress {
  rowIndex: number
  columnIndex: number
}
```

* 状態変更ロジックでは、状態オブジェクトがミュータブルである前提でロジックを書きます。
* 状態変更ロジックを記述するクラスは「状態を変更する関数を受け取って実際の更新処理を行う関数」を受け取ります（状態の更新処理を抽象化します）。状態の変更はこの関数を介して行います。

[usecase/src/WorksheetOperations.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/usecase/src/WorksheetOperations.ts)

```typescript
export class WorksheetOperations {
  // 慣れないと型が多少複雑に見えるかもしれません。後述する利用側のコードを読む方が分かりやすいと思います。
  // 「状態を変更する関数 `mutate: (state: Worksheet) => void` を受け取って実際の更新処理を行う関数 `update`」を受け取っています。
  constructor(private readonly update: (mutate: (state: Worksheet) => void) => unknown) {}

  // 状態を更新する際には、状態オブジェクトを直接変更する関数を更新関数に渡します。解釈は更新関数側でなんとでもできます。
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

* 状態オブジェクトがミュータブルな前提で使えるフレームワークでは、「状態を変更する関数を受け取って実際の更新処理を行う関数」として単純に `mutate => mutate(state)` を使います。

[apps/vuejs-app/src/Worksheet.vue#L43](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/vuejs-app/src/Worksheet.vue#L43)

```typescript
  const worksheet = Vue.observable(createWorksheet())
  const worksheetOperations = new WorksheetOperations(mutate => mutate(worksheet))
```

* 状態オブジェクトがイミュータブルな前提で使うフレームワークでは、「状態を変更する関数を受け取って実際の更新処理を行う関数」として、 immer の `produce()` 関数を介した `mutate => state = produce(state, mutate)` のような関数を使います。
  * `produce(state, mutate)` は `produce(mutate)(state)` とも記述できるので、 React では `mutate => setState(state => produce(state, mutate))` の代わりに `mutate => setState(produce(mutate))` と記述できます。

[apps/react-app/src/Worksheet.tsx](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/react-app/src/Worksheet.tsx#L96)

```typescript
import produce from 'immer'

export default () => {
  const [state, setState] = React.useState(createWorksheet())
  const worksheetOperations = new WorksheetOperations(mutate => setState(produce(mutate)))
  /* ... */
}
```

* 状態を rxjs の BehaviorSubject として持つ場合も immer を介します。

[apps/angular-app/src/app/worksheet.services.ts](https://github.com/luncheon/framework-agnostic-frontend-usecase-example/blob/master/apps/angular-app/src/app/worksheet.services.ts#L11)

```typescript
import produce from 'immer'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class WorksheetService {
  private readonly _worksheet = new BehaviorSubject<Worksheet>(createWorksheet())
  readonly worksheetOperations = new WorksheetOperations(mutate => this._worksheet.next(produce(this._worksheet.value, mutate)))
}
```

* いずれの例でも、 `worksheetOperations.setActiveCellAddress(rowIndx, columnIndex)` を同じように呼べば、適切に状態が更新（変更または生成）されて画面に反映されます。


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
