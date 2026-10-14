// 用 IndexedDB 在页面间传递“打开我自己的文件”的文件（支持大文件）
function idbOpen(){return new Promise((ok,no)=>{const r=indexedDB.open('arcade-own',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
async function idbPut(k,v){const db=await idbOpen();return new Promise((ok,no)=>{const t=db.transaction('f','readwrite');t.objectStore('f').put(v,k);t.oncomplete=ok;t.onerror=()=>no(t.error)})}
async function idbGet(k){const db=await idbOpen();return new Promise((ok,no)=>{const r=db.transaction('f').objectStore('f').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
