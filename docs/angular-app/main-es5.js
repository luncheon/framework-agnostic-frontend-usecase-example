(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../../usecase/es/Worksheet.js":
/*!***********************************************************************************************************!*\
  !*** /Users/takeuchi.kazuto/projects/framework-agnostic-frontend-usecase-example/usecase/es/Worksheet.js ***!
  \***********************************************************************************************************/
/*! exports provided: createEmptyWorksheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmptyWorksheet", function() { return createEmptyWorksheet; });
const createEmptyWorksheet = ({ maxCellAddress }) => ({
    maxCellAddress,
    activeCellAddress: { rowIndex: 0, columnIndex: 0 },
    cellContents: [],
});


/***/ }),

/***/ "../../usecase/es/WorksheetOperations.js":
/*!*********************************************************************************************************************!*\
  !*** /Users/takeuchi.kazuto/projects/framework-agnostic-frontend-usecase-example/usecase/es/WorksheetOperations.js ***!
  \*********************************************************************************************************************/
/*! exports provided: WorksheetOperations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorksheetOperations", function() { return WorksheetOperations; });
class WorksheetOperations {
    constructor(update) {
        this.update = update;
    }
    setActiveCellAddress(rowIndex, columnIndex) {
        this.update(({ maxCellAddress, activeCellAddress }) => {
            if (typeof rowIndex === 'number' && rowIndex >= 0 && rowIndex <= maxCellAddress.rowIndex) {
                activeCellAddress.rowIndex = rowIndex;
            }
            if (typeof columnIndex === 'number' && columnIndex >= 0 && columnIndex <= maxCellAddress.columnIndex) {
                activeCellAddress.columnIndex = columnIndex;
            }
        });
        return this;
    }
    moveActiveCellAddress(rowOffset, columnOffset) {
        this.update(({ maxCellAddress, activeCellAddress }) => {
            if (typeof rowOffset === 'number' && rowOffset) {
                activeCellAddress.rowIndex = Math.min(Math.max(0, activeCellAddress.rowIndex + rowOffset), maxCellAddress.rowIndex);
            }
            if (typeof columnOffset === 'number' && columnOffset) {
                activeCellAddress.columnIndex = Math.min(Math.max(0, activeCellAddress.columnIndex + columnOffset), maxCellAddress.columnIndex);
            }
        });
        return this;
    }
    setActiveCellContent(content) {
        this.update(({ activeCellAddress: { rowIndex, columnIndex }, cellContents }) => {
            if (content) {
                cellContents[rowIndex] = cellContents[rowIndex] || [];
                cellContents[rowIndex][columnIndex] = content;
            }
            else {
                const row = cellContents[rowIndex];
                if (!row || !row[columnIndex]) {
                    return;
                }
                delete cellContents[rowIndex][columnIndex];
                while (row.length && !row[row.length - 1]) {
                    row.pop();
                }
                if (row.length) {
                    return;
                }
                delete cellContents[rowIndex];
                while (cellContents.length && !cellContents[cellContents.length - 1]) {
                    cellContents.pop();
                }
            }
        });
        return this;
    }
}


/***/ }),

/***/ "../../usecase/es/index.js":
/*!*******************************************************************************************************!*\
  !*** /Users/takeuchi.kazuto/projects/framework-agnostic-frontend-usecase-example/usecase/es/index.js ***!
  \*******************************************************************************************************/
/*! exports provided: createEmptyWorksheet, WorksheetOperations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Worksheet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Worksheet */ "../../usecase/es/Worksheet.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createEmptyWorksheet", function() { return _Worksheet__WEBPACK_IMPORTED_MODULE_0__["createEmptyWorksheet"]; });

/* harmony import */ var _WorksheetOperations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WorksheetOperations */ "../../usecase/es/WorksheetOperations.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WorksheetOperations", function() { return _WorksheetOperations__WEBPACK_IMPORTED_MODULE_1__["WorksheetOperations"]; });





/***/ }),

/***/ "../common/createWorksheet.ts":
/*!************************************!*\
  !*** ../common/createWorksheet.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usecase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../usecase */ "../../usecase/es/index.js");

/* harmony default export */ __webpack_exports__["default"] = (function () { return Object(_usecase__WEBPACK_IMPORTED_MODULE_0__["createEmptyWorksheet"])({
    maxCellAddress: {
        rowIndex: 99,
        columnIndex: 99,
    }
}); });


/***/ }),

/***/ "../common/createWorksheetKeyEventHandler.ts":
/*!***************************************************!*\
  !*** ../common/createWorksheetKeyEventHandler.ts ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (operations) { return function (event) {
    // ignore IME conversion
    if (event.keyCode === 229) {
        return;
    }
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            operations.moveActiveCellAddress(1);
            break;
        case 'ArrowLeft':
            event.preventDefault();
            operations.moveActiveCellAddress(0, -1);
            break;
        case 'ArrowRight':
            event.preventDefault();
            operations.moveActiveCellAddress(0, 1);
            break;
        case 'ArrowUp':
            event.preventDefault();
            operations.moveActiveCellAddress(-1);
            break;
        case 'Tab':
            event.preventDefault();
            operations.moveActiveCellAddress(0, event.shiftKey ? -1 : 1);
            break;
        case 'Enter':
            event.preventDefault();
            operations.moveActiveCellAddress(event.shiftKey ? -1 : 1);
            break;
        default:
            break;
    }
}; });


/***/ }),

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: "<app-worksheet></app-worksheet>",
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _worksheet_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./worksheet.component */ "./src/app/worksheet.component.ts");
/* harmony import */ var _worksheet_services__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./worksheet.services */ "./src/app/worksheet.services.ts");







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _worksheet_component__WEBPACK_IMPORTED_MODULE_5__["WorksheetComponent"],
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__["SharedModule"],
            ],
            providers: [
                _worksheet_services__WEBPACK_IMPORTED_MODULE_6__["WorksheetService"],
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]],
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/shared/auto-focus.directive.ts":
/*!************************************************!*\
  !*** ./src/app/shared/auto-focus.directive.ts ***!
  \************************************************/
/*! exports provided: AutoFocusDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoFocusDirective", function() { return AutoFocusDirective; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AutoFocusDirective = /** @class */ (function () {
    function AutoFocusDirective(elementRef) {
        this.elementRef = elementRef;
    }
    AutoFocusDirective.prototype.ngAfterViewInit = function () {
        this.elementRef.nativeElement.focus();
    };
    AutoFocusDirective = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
            selector: '[appAutoFocus]',
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], AutoFocusDirective);
    return AutoFocusDirective;
}());



/***/ }),

/***/ "./src/app/shared/range.pipe.ts":
/*!**************************************!*\
  !*** ./src/app/shared/range.pipe.ts ***!
  \**************************************/
/*! exports provided: RangePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RangePipe", function() { return RangePipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var RangePipe = /** @class */ (function () {
    function RangePipe() {
    }
    RangePipe.prototype.transform = function (end) {
        return Array(end).slice().map(function (_, index) { return index; });
    };
    RangePipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({ name: 'appRange' })
    ], RangePipe);
    return RangePipe;
}());



/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _range_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./range.pipe */ "./src/app/shared/range.pipe.ts");
/* harmony import */ var _auto_focus_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auto-focus.directive */ "./src/app/shared/auto-focus.directive.ts");




var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _auto_focus_directive__WEBPACK_IMPORTED_MODULE_3__["AutoFocusDirective"],
                _range_pipe__WEBPACK_IMPORTED_MODULE_2__["RangePipe"],
            ],
            exports: [
                _auto_focus_directive__WEBPACK_IMPORTED_MODULE_3__["AutoFocusDirective"],
                _range_pipe__WEBPACK_IMPORTED_MODULE_2__["RangePipe"],
            ],
        })
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/app/worksheet.component.ts":
/*!****************************************!*\
  !*** ./src/app/worksheet.component.ts ***!
  \****************************************/
/*! exports provided: WorksheetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorksheetComponent", function() { return WorksheetComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _worksheet_services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./worksheet.services */ "./src/app/worksheet.services.ts");
/* harmony import */ var _common_createWorksheetKeyEventHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/createWorksheetKeyEventHandler */ "../common/createWorksheetKeyEventHandler.ts");




var WorksheetComponent = /** @class */ (function () {
    function WorksheetComponent(_worksheet) {
        this._worksheet = _worksheet;
        this.worksheet$ = this._worksheet.worksheet$;
        this.worksheetOperations = this._worksheet.worksheetOperations;
        this._worksheetKeyEventHandler = Object(_common_createWorksheetKeyEventHandler__WEBPACK_IMPORTED_MODULE_3__["default"])(this.worksheetOperations);
    }
    WorksheetComponent.prototype.ngOnInit = function () {
        window.addEventListener('keydown', this._worksheetKeyEventHandler);
    };
    WorksheetComponent.prototype.ngOnDestroy = function () {
        window.removeEventListener('keydown', this._worksheetKeyEventHandler);
    };
    WorksheetComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-worksheet',
            template: "\n    <table class=\"worksheet\" *ngIf=\"worksheet$ | async as worksheet\">\n      <thead>\n        <tr>\n          <th></th>\n          <th *ngFor=\"let columnIndex of worksheet.maxCellAddress.columnIndex + 1 | appRange\">{{columnIndex}}</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr *ngFor=\"let rowIndex of worksheet.maxCellAddress.rowIndex + 1 | appRange\">\n          <th>{{rowIndex}}</th>\n          <ng-container *ngFor=\"let columnIndex of worksheet.maxCellAddress.columnIndex + 1 | appRange\">\n            <ng-content *ngTemplateOutlet=\"cellTemplate; context: {\n              rowIndex: rowIndex,\n              columnIndex: columnIndex,\n              active: rowIndex === worksheet.activeCellAddress.rowIndex && columnIndex === worksheet.activeCellAddress.columnIndex,\n              content: worksheet.cellContents[rowIndex] && worksheet.cellContents[rowIndex][columnIndex] || ''\n            }\">\n            </ng-content>\n          </ng-container>\n        </tr>\n      </tbody>\n    </table>\n\n    <ng-template\n      #cellTemplate\n      let-rowIndex=\"rowIndex\"\n      let-columnIndex=\"columnIndex\"\n      let-active=\"active\"\n      let-content=\"content\"\n    >\n      <td\n        [attr.data-row-index]=\"rowIndex\"\n        [attr.data-column-index]=\"columnIndex\"\n        [class.active]=\"active\"\n        (click)=\"worksheetOperations.setActiveCellAddress(rowIndex, columnIndex)\"\n      >\n        <input\n          *ngIf=\"active else inactive\"\n          [value]=\"content\"\n          (input)=\"worksheetOperations.setActiveCellContent($event.target.value)\"\n          appAutoFocus\n        >\n        <ng-template #inactive>{{content}}</ng-template>\n      </td>\n    </ng-template>\n  ",
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_worksheet_services__WEBPACK_IMPORTED_MODULE_2__["WorksheetService"]])
    ], WorksheetComponent);
    return WorksheetComponent;
}());



/***/ }),

/***/ "./src/app/worksheet.services.ts":
/*!***************************************!*\
  !*** ./src/app/worksheet.services.ts ***!
  \***************************************/
/*! exports provided: WorksheetService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorksheetService", function() { return WorksheetService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var immer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! immer */ "./node_modules/immer/dist/immer.module.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _usecase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../usecase */ "../../usecase/es/index.js");
/* harmony import */ var _common_createWorksheet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/createWorksheet */ "../common/createWorksheet.ts");






var WorksheetService = /** @class */ (function () {
    function WorksheetService() {
        var _this = this;
        this._worksheet = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](Object(_common_createWorksheet__WEBPACK_IMPORTED_MODULE_5__["default"])());
        this.worksheetOperations = new _usecase__WEBPACK_IMPORTED_MODULE_4__["WorksheetOperations"](function (mutate) { return _this._worksheet.next(Object(immer__WEBPACK_IMPORTED_MODULE_2__["default"])(_this._worksheet.value, mutate)); });
        this.worksheet$ = this._worksheet.asObservable();
    }
    WorksheetService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], WorksheetService);
    return WorksheetService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])()
    .bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/takeuchi.kazuto/projects/framework-agnostic-frontend-usecase-example/apps/angular-app/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es5.js.map