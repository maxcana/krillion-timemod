// ==UserScript==
// @name        krillion timemod
// @namespace   krillion scripts
// @icon        https://krillion.io/icon.png?icon.10narxa3_gvth.png?dpl=dpl_6VihiPCXNKV941VNtLNKp7niRG3e
// @version     1.0.0
//
// @match       https://krillion.io/*
// @grant       none
//
// @author      github/maxcana
// @description increases time limit however much you wish. default is 50s (2x original)
//
// @run-at      document-start
// ==/UserScript==

// CONFIG
const NEW_TIME_MS = 50_000




if (globalThis.TURBOPACK) {
    console.error("too late")
}

let FAKE_TURBOPACK = undefined

Object.defineProperty(globalThis, "TURBOPACK", {
    get: () => FAKE_TURBOPACK,
    set: function (real_turbopack) {
        // runtime assigns { push: F } here (deob/turbopack-15ml26dbdhvdy.js line 667)
        let real_push = real_turbopack.push
        
        FAKE_TURBOPACK = real_turbopack;
        FAKE_TURBOPACK.push = function (stuff) {
            // call structure push([<script>, module id, MODULE, module id, MODULE, module id, MODULE, ...])
            for (let i = 1; i < stuff.length; i++){
                if (typeof stuff[i] !== "function") continue
                
                let module = stuff[i]

                console.log(module)
                i += 2
            }
            real_push.call(real_turbopack, stuff)
        }
    },
});