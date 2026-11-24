// ==UserScript==
// @name        krillion timemod
// @namespace   krillion scripts
// @icon        https://krillion.io/icon.png?icon.10narxa3_gvth.png?dpl=dpl_6VihiPCXNKV941VNtLNKp7niRG3e
// @version     1.0.0
//
// @match       https://krillion.io/*
// @grant       none
//
// @author      maxcana
// @description increases time limit however much you wish. default is 50s (2x original)
//
// @run-at      document-start
// @license     MIT
// ==/UserScript==

// ----- CONFIG -----
const NEW_TIME_MS = 50_000

if (globalThis.TURBOPACK) {
    console.error("too late")
}



// ----- larping as turbopack -----

let FAKE_TURBOPACK = undefined

Object.defineProperty(globalThis, "TURBOPACK", {
    get: () => FAKE_TURBOPACK,

    set: function (real_turbopack) {
        let real_push = real_turbopack.push

        FAKE_TURBOPACK = real_turbopack
        FAKE_TURBOPACK.push = function (stuff) {
            // example call: .push([script, module id, MODULE FN, module id, MODULE FN, module id, MODULE FN, ...])
            for (let i = 1; i < stuff.length; i++) {
                if (typeof stuff[i] !== "function") continue

                // example module fn: (e,r,s) => { e.s(["MAX_ANSWER_LENGTH", 0, 256]); }
                let module_fn = stuff[i]
                stuff[i] = function hooked_module(e, ...whatever) {
                    // patch e.s (export consts function)
                    let e_s = e.s
                    e.s = function fake_export(arr, ...whatever) {
                        if (arr[0] === "ANSWER_MS") {
                            console.log(`[timemod] module_${stuff[i - 1]} just exported ${arr[0]}, switching ${arr[2]} -> ${NEW_TIME_MS}`)
                            arr[2] = NEW_TIME_MS
                        }
                        e_s.call(e, arr, ...whatever)
                    }
                    return module_fn.call(this, e, ...whatever)
                }
            }
            real_push.call(real_turbopack, stuff)
        }
    },
})