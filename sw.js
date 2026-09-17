/* ERP-FIC demo service worker — replays a recorded session with zero backend.
   v3: POST bodies are part of the lookup key, and the fallback for un-recorded
   endpoints returns the SHAPE each Frappe caller destructures, so the desk takes
   its normal path instead of throwing on `undefined.x`.
   (Original bug: a bare {"message":null} made pageview.js crash at
    `r2.docs._dynamic_page`.) */
const CACHE = 'erpfic-demo-mu5op0rx-g0od3';
const SHELL = '/index.html';
const PRECACHE = ["/404.html","/__api/003219845f227128.txt","/__api/0058a8ef412ffe56.txt","/__api/0170f81db4f1fbcb.txt","/__api/01d5cdc97650cf4c.txt","/__api/0250160c9780f375.txt","/__api/02dc93c3e3b58b3c.txt","/__api/03c401884f0694e4.txt","/__api/03ec84aa27bebc17.txt","/__api/04c164e6e579a06e.txt","/__api/04cefbbe5d2e918d.txt","/__api/06381013c65b9572.txt","/__api/06c086af6f1eaec5.txt","/__api/07c3c88d1d9350a5.txt","/__api/08481406b8862634.txt","/__api/085f0e03c4d858dc.txt","/__api/08d3152213599191.txt","/__api/09874dec9c3f4d59.txt","/__api/0b9edda32de80c59.txt","/__api/0cf1233a5a97c891.txt","/__api/0d0e5061fa8bbda1.txt","/__api/0d27ac5b3b9e5a9d.txt","/__api/0dc9b445197ceae7.txt","/__api/0e7e8f38a2b5b8a3.txt","/__api/0ed6ffeb7ff59249.txt","/__api/0f5d61fcb7b200b7.txt","/__api/0f91acce97ad92bd.txt","/__api/10f68970a3eed1da.txt","/__api/11cfdcec6e69e9d8.txt","/__api/12ee70062f809fea.txt","/__api/13acefcdd220edcc.txt","/__api/142b7322fb288f07.txt","/__api/1567babe1b6368f0.txt","/__api/15c04a1244e4f53b.txt","/__api/161ea9d8819c8acd.txt","/__api/16aebbe292b145a9.txt","/__api/16df54000147875b.txt","/__api/1721700842361c77.txt","/__api/177b51d8d8326af7.txt","/__api/17858ca67dff4790.txt","/__api/185727731f56c38e.txt","/__api/196cb21b431b3b82.txt","/__api/1993db256d736556.txt","/__api/19e2638af03d554c.txt","/__api/1a29d507f26b83cc.txt","/__api/1af28a3229adbee0.txt","/__api/1aff0362ca73d0a4.txt","/__api/1b342821df183f6e.txt","/__api/1b6073531046daa4.txt","/__api/1c785c060c5e3c4d.txt","/__api/1d044c97470e7f59.txt","/__api/1dba8e043fd536ef.txt","/__api/1e4fb4e5efb87775.txt","/__api/1ef88c39f113254a.txt","/__api/1f1098ee471bf11b.txt","/__api/1f54fad078744681.txt","/__api/2059c0970124d961.txt","/__api/205b712b40d22e17.txt","/__api/209d5b6f85d8ad6b.txt","/__api/20d3751d6f3c70b4.txt","/__api/212c5258fb3f9b70.txt","/__api/22084d08eb0cc4b6.txt","/__api/220b747ff94b4474.txt","/__api/2319ad26915ff343.txt","/__api/235cd3eccae44078.txt","/__api/2544efced5dd9ba9.txt","/__api/26973704adf49ca8.txt","/__api/283fe01a93a21d3b.txt","/__api/2a0a3a1124ec255c.txt","/__api/2a380e759aeb183d.txt","/__api/2a829723803126cc.txt","/__api/2a82fe2ea80d2f10.txt","/__api/2bd563deca0dee9a.txt","/__api/2bd5aa84325686a3.txt","/__api/2c5a3433f595501b.txt","/__api/2ce0b3d34ff699bb.txt","/__api/2d4f491336cdf28b.txt","/__api/2d9b23f9b25b607e.txt","/__api/2ea1609e62516027.txt","/__api/2f4982129cea213b.txt","/__api/30065b8e11873cae.txt","/__api/3262e3f35aaffaa9.txt","/__api/331fa38487351921.txt","/__api/333e4ee4c2984fdf.txt","/__api/3407ded5fddbabbe.txt","/__api/349cc72321b9edb8.txt","/__api/34de52823f626bdf.txt","/__api/34e7acd24d52864d.txt","/__api/3567ea05b79d0acb.txt","/__api/35a0d4452c7b759f.txt","/__api/3668281a4a441863.txt","/__api/374ae5e29cab8eaf.txt","/__api/37cb2bdabbb6a817.txt","/__api/3897e5f9fab15335.txt","/__api/3adedac80de3b7d2.txt","/__api/3bdd11bf0b881e61.txt","/__api/3bdfd4ec7ce75995.txt","/__api/3c40416b8746de0b.txt","/__api/3c666ef6b0b25213.txt","/__api/3c694a962fb06e95.txt","/__api/3f2ad23dff1bd70b.txt","/__api/3fc83fa96bcf1aab.txt","/__api/4077d448e5b520e8.txt","/__api/410d9947d6b2f64b.txt","/__api/41d80e917ba62875.txt","/__api/454eb56af5119a54.txt","/__api/4610a5f0059f0b4d.txt","/__api/46be5d1b68b9aefa.txt","/__api/47b2e839752604ec.txt","/__api/4833331020a3ddca.txt","/__api/48a57417c257a6cb.txt","/__api/4972a5b4d20c4e59.txt","/__api/4aa5b0f1d8d9aae6.txt","/__api/4bd626a2e18a96be.txt","/__api/4beb63bfdc67c07f.txt","/__api/4d3e1b5bd06af72f.txt","/__api/4e12ea10e351865e.txt","/__api/4eca53619c228a96.txt","/__api/4fd36274231d03da.txt","/__api/501292d3095091af.txt","/__api/50f4b81b4366d33d.txt","/__api/513f07a31a7d7050.txt","/__api/52a5e00ec4f700de.txt","/__api/5326be02f3fa9657.txt","/__api/532f7b81b78681ef.txt","/__api/53952c96412a7e5e.txt","/__api/539dae6a2f7c0711.txt","/__api/53c2c42c03c17d5b.txt","/__api/53e30193328e3682.txt","/__api/53e53f43405ad968.txt","/__api/53ee16551ad22ed9.txt","/__api/5433359b704b1f30.txt","/__api/555e58ba8c6b31e7.txt","/__api/55ee109dea6cd1d6.txt","/__api/574559f905b6be2f.txt","/__api/57834c4aa3db0372.txt","/__api/57fee5637d658021.txt","/__api/58bd59aae16df2e0.txt","/__api/5948e20196cec4b1.txt","/__api/5a4aa0d933d999ba.txt","/__api/5a5798a46a91b706.txt","/__api/5b0c89a56a6db5b5.txt","/__api/5baee88e87ac76a7.txt","/__api/5c58fc019e473b6b.txt","/__api/5d44cf677c97178d.txt","/__api/5d977aee6e782946.txt","/__api/5e68e2194613530b.txt","/__api/5f96c9d56263ed87.txt","/__api/5fac1747553ee4f7.txt","/__api/5fdbd1853958bd95.txt","/__api/60239a219551dbc7.txt","/__api/604adfd7b45cfe6a.txt","/__api/60edb239b2874ffb.txt","/__api/6193772964edcd64.txt","/__api/61a410c832abacdd.txt","/__api/624fac54145ecaea.txt","/__api/628b3fe41795438c.txt","/__api/62fce3916cd99597.txt","/__api/634a9d621706afeb.txt","/__api/6351b1e99c51afaf.txt","/__api/641de024102bbd79.txt","/__api/648133333464e909.txt","/__api/64faaaa07e36a0b2.txt","/__api/66698d3a7ef3d454.txt","/__api/66957d43cab355d6.txt","/__api/66daf3b2790d0a40.txt","/__api/69022ab9ad3e464f.txt","/__api/695a765da4a0521b.txt","/__api/69bda1547ec5ecc0.txt","/__api/6c64301490032378.txt","/__api/6d7d0e6ae1ed8114.txt","/__api/6db218fc649ed07a.txt","/__api/6e2e42d23b799381.txt","/__api/6f53ce660ae31b97.txt","/__api/70b07d5e785fef31.txt","/__api/710471ce2af9c757.txt","/__api/710d818744753997.txt","/__api/718f7161bd158af0.txt","/__api/71ac7fb541f0e7a1.txt","/__api/71c7d89c29909a1f.txt","/__api/71f2c6834efc53aa.txt","/__api/723ff156662bcb1e.txt","/__api/73cde8fc711e0690.txt","/__api/742b0b59536ab3fa.txt","/__api/761a77f92d5d69c0.txt","/__api/76d5843fc5ebc9ec.txt","/__api/76eedf8554305336.txt","/__api/771f7b836dfe2131.txt","/__api/775f85ea392ec7b3.txt","/__api/776e74ff2d3fbd37.txt","/__api/77cdc4eea6a1fc0a.txt","/__api/7804d1489a3321cb.txt","/__api/783525fa8dcf59ca.txt","/__api/78ab7c0f521b6cc1.txt","/__api/7ad3a296b5d9cb66.txt","/__api/7b6741f111c420bf.txt","/__api/7c1b67d80a5ca362.txt","/__api/7c8b83dd5c3b7bf3.txt","/__api/7cad2fce7689f182.txt","/__api/7d78a05ee1f30c73.txt","/__api/7e9e466f95c9b93a.txt","/__api/801d617775854ed7.txt","/__api/80dd04f106b61bf0.txt","/__api/812e6141d88b5530.txt","/__api/81b2cad679b99acd.txt","/__api/8206319559fe32b0.txt","/__api/82b1491d909eaff2.txt","/__api/82c8ebc7f401409c.txt","/__api/82ee51b7ef3dfebe.txt","/__api/855e82a8caf720c9.txt","/__api/85a94df58c9349a1.txt","/__api/8614af6a8fe663b0.txt","/__api/869f95413cc972b4.txt","/__api/8770710ead9df1d3.txt","/__api/877de1d27b2b3759.txt","/__api/881cd97e317a48b9.txt","/__api/88843ffbbfb63609.txt","/__api/88bd544aeff653ca.txt","/__api/8911f8e8f002ef50.txt","/__api/8a7736fa138de82a.txt","/__api/8a8abfa0dc296f8e.txt","/__api/8e3d8951bcab66bd.txt","/__api/8ea03c972c3c0971.txt","/__api/8ef747b2db6e9edf.txt","/__api/8f95b12ccc99b15a.txt","/__api/909583422e87e9fd.txt","/__api/91b0c88ed8f0a1a0.txt","/__api/923f94c72b853a27.txt","/__api/92722fc1d97bc588.txt","/__api/936e241d297f64b1.txt","/__api/9399040d9addea56.txt","/__api/955e406c7929c12a.txt","/__api/966eeba363284b65.txt","/__api/96c3932ef5f6e84d.txt","/__api/974bf374ea6a1f8c.txt","/__api/9765c7316732fe3a.txt","/__api/9784db3b128b7505.txt","/__api/97b9236b18c586f5.txt","/__api/97e5e3ece3dd10c8.txt","/__api/9a19ab52a70ce01e.txt","/__api/9b43f9718a421e1b.txt","/__api/9b843aa862ba3907.txt","/__api/9de105a56f5a33df.txt","/__api/9e04a423b7b94ee4.txt","/__api/9e28f519dbd36f4c.txt","/__api/9e5e27a269a3faa6.txt","/__api/a06dca300d2bf554.txt","/__api/a0fd23ee5319711f.txt","/__api/a103bbb10461bba4.txt","/__api/a1161c7ac2a04d9e.txt","/__api/a123be4cd118ec12.txt","/__api/a19ac4be1f7bc4cd.txt","/__api/a203d901ea83f7b5.txt","/__api/a21ce4b0a07a6edb.txt","/__api/a227f57339272ddf.txt","/__api/a34050c884c146a4.txt","/__api/a4ca9ed60450cc4a.txt","/__api/a4e39eddead1a1df.txt","/__api/a67cb3fd19812dc7.txt","/__api/a72805b955e2053f.txt","/__api/a739190548dd2556.txt","/__api/a76cffcb580d6ae6.txt","/__api/a9270334ad3a89fe.txt","/__api/a95f24222b376d1d.txt","/__api/a97f58e780be9a84.txt","/__api/abe8a1957baac0c6.txt","/__api/ac47625e7453f9b3.txt","/__api/ac77d380db78417e.txt","/__api/ac95ca22b26a92aa.txt","/__api/acca6f732bfdd594.txt","/__api/ad4e25c2bb2c0d26.txt","/__api/aec0eb377db848e2.txt","/__api/aed7e6b87c4efae8.txt","/__api/aef824c35007d032.txt","/__api/afe83a504154cce8.txt","/__api/b017b4a5b2cbc968.txt","/__api/b0c4582ec2d5b3b5.txt","/__api/b1756bf73f7e1995.txt","/__api/b1ec92808147a713.txt","/__api/b205ae75db017f7b.txt","/__api/b2b1df8d32bbc41e.txt","/__api/b38b469c7f4ad7b1.txt","/__api/b4cc6fa80bfecec4.txt","/__api/b577725ee642f29b.txt","/__api/b6007f40fdf06cd3.txt","/__api/b684b8f599998b56.txt","/__api/b8c41eafc082df80.txt","/__api/ba125d4d9f0b17d8.txt","/__api/baac8e543d94aa0e.txt","/__api/bb07252110726e97.txt","/__api/bb7b26d20c3367ce.txt","/__api/bba4b81651908e58.txt","/__api/bc3f4da695d4ec13.txt","/__api/bd0964c69f64a55c.txt","/__api/bddca73dd847fd8c.txt","/__api/bdea4df9a3a26665.txt","/__api/be2c775ddf44197f.txt","/__api/bfe78cb8909afa9b.txt","/__api/bff8ccd1f6e67209.txt","/__api/c01a51f574b1d1f5.txt","/__api/c07dce49aeda4307.txt","/__api/c0ddece990eab6eb.txt","/__api/c1a0b17da626fbc4.txt","/__api/c242a805e9637950.txt","/__api/c281963d6c2c8b0e.txt","/__api/c3508802161a54c7.txt","/__api/c46022eade3e9a78.txt","/__api/c4640a41bb0008e8.txt","/__api/c48207c6dcad7f20.txt","/__api/c4d7f9be3feb4a09.txt","/__api/c52271a1c98720f3.txt","/__api/c54992c215967ff2.txt","/__api/c617b0491d908b46.txt","/__api/c657b6204e50b45f.txt","/__api/c68a7ab304c4b8d7.txt","/__api/c7398ec0645a7ea5.txt","/__api/c7c0725c7758ef72.txt","/__api/c8353f57eccd76da.txt","/__api/c8f92e484b6abb43.txt","/__api/c920712b9da84212.txt","/__api/c92e8470ea1073e4.txt","/__api/c9d4d20d0615ba81.txt","/__api/caa195303edd51b6.txt","/__api/cbb91b717aec2934.txt","/__api/cc569cf2eb4c6a0a.txt","/__api/cc56db2df5b3ec56.txt","/__api/cca0e87d9529b0b0.txt","/__api/cce4fde5ca72e584.txt","/__api/ce91f4c61862d8ad.txt","/__api/cf2860cd6455711b.txt","/__api/cf3318300fb31872.txt","/__api/cfabc9f6d6e0f5f0.txt","/__api/d0744c494ce9fda8.txt","/__api/d090d1d964212462.txt","/__api/d1f7b03ca7447f35.txt","/__api/d36644e9b4e23b95.txt","/__api/d4b6119e69c0dee9.txt","/__api/d56c4b96b7841b2e.txt","/__api/d5f929e00bcf2425.txt","/__api/d6810c9b7a28748a.txt","/__api/d726d05cf4596af3.txt","/__api/d74446ea4733a8e6.txt","/__api/d817d45bd60bf997.txt","/__api/d8decd1f1a7df639.txt","/__api/da0f99466da70e6a.txt","/__api/da93220bf8534cb1.txt","/__api/dadc1072aba030c7.txt","/__api/db3f241802b4231c.txt","/__api/dde3e2065b82b8a1.txt","/__api/de3ce09627f279ea.txt","/__api/df0e28afe803a558.txt","/__api/df266daad2950fec.txt","/__api/df6c848956c0e075.txt","/__api/df83543a7bfc3a68.txt","/__api/e0233fc8aa886de3.txt","/__api/e02d2da6c5f15486.txt","/__api/e078ec7f2f94f045.txt","/__api/e19eb9e273b60aa3.txt","/__api/e28c9f22181e47da.txt","/__api/e357c0d031933c3b.txt","/__api/e373109e11723b73.txt","/__api/e3ab50946bf642bf.txt","/__api/e489993c7e832407.txt","/__api/e51dc046b8e4d252.txt","/__api/e54776bd8dd2d84d.txt","/__api/e580ea91dd55ceee.txt","/__api/e5ebd2b781f07b86.txt","/__api/e7375b024fa906e3.txt","/__api/e7b89361b40794e6.txt","/__api/e7ddbd216fa954a8.txt","/__api/e808f2fe4dbfd392.txt","/__api/e8224302ff78cf4b.txt","/__api/e8fbfeaa0e20e550.txt","/__api/e92cdfffdbac0dbd.txt","/__api/e9fee3ca5ee7e4de.txt","/__api/ea5ccbc2595dcc03.txt","/__api/ebb5c6506a4c830d.txt","/__api/ebfc905f3ea4b488.txt","/__api/ed0266a3620bf237.txt","/__api/ef6cf6eaa4d0160c.txt","/__api/f01070e0bf3d2550.txt","/__api/f08157003cc80279.txt","/__api/f0c63183fb219212.txt","/__api/f0dfb7af6e2f1e09.txt","/__api/f15df0bb4532c7e5.txt","/__api/f183f3dc86a52f8f.txt","/__api/f1c29c50ac0b9425.txt","/__api/f57ee6ce09af2c7e.txt","/__api/f735044dcf551941.txt","/__api/f7617ba432dbc663.txt","/__api/f9d8f8351604e620.txt","/__api/fa681582a64ad2b4.txt","/__api/fbfdbf8db31e906a.txt","/__api/fc6abc1aa1365c82.txt","/__api/fce153bdc7a20098.txt","/__api/fd1270e9ef1ede19.txt","/__api/fd65e203b40106d6.txt","/__api/fdb4cb6cc13f656a.txt","/__api/fe1abf05f19aa5cb.txt","/__api/fee35a4c8367f95f.txt","/__api/ff0d9a0f29d0b8ec.txt","/__api/ff6a03798da051bb.txt","/__api/index.json","/__assets.json","/_redirects","/apple-touch-icon.png","/assets/erpnext/dist/css/erpnext-web.bundle.6OGR6NMT.css","/assets/erpnext/dist/css-rtl/erpnext.bundle.RHDDTUCK.css","/assets/erpnext/dist/js/erpnext-web.bundle.253I7LT4.js","/assets/erpnext/dist/js/erpnext.bundle.ZO25VGKE.js","/assets/erpnext/images/erpnext-logo.svg","/assets/erpnext/sounds/call-disconnect.mp3","/assets/erpnext/sounds/incoming-call.mp3","/assets/fic_app/css/mobile.css","/assets/fic_app/css/quick_switch.css","/assets/fic_app/images/erp-fic-favicon.svg","/assets/fic_app/images/erp-fic-logo.svg","/assets/fic_app/js/branding.js","/assets/fic_app/js/mobile.js","/assets/fic_app/js/quick_switch.js","/assets/frappe/css/fonts/inter/Inter-Bold.woff2","/assets/frappe/css/fonts/inter/Inter-Medium.woff2","/assets/frappe/css/fonts/inter/Inter-Regular.woff2","/assets/frappe/css/fonts/inter/Inter-SemiBold.woff2","/assets/frappe/css/fonts/inter/InterVariable.woff2","/assets/frappe/dist/css/login.bundle.XEZMKKC5.css","/assets/frappe/dist/css/website.bundle.5DQWEBGP.css","/assets/frappe/dist/css-rtl/desk.bundle.ZHZMOSWP.css","/assets/frappe/dist/css-rtl/report.bundle.H2VGWSNC.css","/assets/frappe/dist/js/billing.bundle.CPRCUCBA.js","/assets/frappe/dist/js/build_events.bundle.3YBJL2VK.js","/assets/frappe/dist/js/controls.bundle.MYWCUMRO.js","/assets/frappe/dist/js/desk.bundle.UBO6BGDN.js","/assets/frappe/dist/js/file_uploader.bundle.PEG3E3ZQ.js","/assets/frappe/dist/js/form.bundle.I73ZTL6H.js","/assets/frappe/dist/js/frappe-web.bundle.VNOKELX3.js","/assets/frappe/dist/js/libs.bundle.LLRFRX7M.js","/assets/frappe/dist/js/list.bundle.2LY27CFR.js","/assets/frappe/dist/js/report.bundle.6TTJHZGN.js","/assets/frappe/dist/js/telemetry.bundle.DQEBDMFO.js","/assets/frappe/dist/js/video_player.bundle.IOEIXC2G.js","/assets/frappe/icons/espresso/icons.svg","/assets/frappe/icons/timeless/icons.svg","/assets/frappe/images/ui-states/event-empty-state.svg","/assets/frappe/images/ui-states/grid-empty-state.svg","/assets/frappe/images/ui-states/list-empty-state.svg","/assets/frappe/images/ui-states/notification-empty-state.svg","/assets/frappe/sounds/alert.mp3","/assets/frappe/sounds/cancel.mp3","/assets/frappe/sounds/click.mp3","/assets/frappe/sounds/delete.mp3","/assets/frappe/sounds/email.mp3","/assets/frappe/sounds/error.mp3","/assets/frappe/sounds/submit.mp3","/icon-192.png","/icon-400.png","/icon-512.png","/icon-maskable-512.png","/index.html","/install.html","/login","/manifest.json","/website_script.js"];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(PRECACHE.map((u) =>
      c.add(new Request(u, { cache: 'reload' })).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

/* ---------- key normalisation (must match recorder.js) ---------- */

function normBody(s) {
  try {
    const clean = (v) => {
      if (Array.isArray(v)) return v.map(clean);
      if (v && typeof v === 'object') {
        const o = {};
        for (const k of Object.keys(v).sort()) { if (k === '_' || k === 'cmd') continue; o[k] = clean(v[k]); }
        return o;
      }
      return v;
    };
    return JSON.stringify(clean(JSON.parse(s)));
  } catch (e) { return String(s).slice(0, 400); }
}
function bh(s) { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); }

function strip(urlStr) {
  const i = urlStr.indexOf('?');
  if (i === -1) return '';
  const sp = new URLSearchParams(urlStr.slice(i + 1));
  sp.delete('_'); sp.delete('cached_timestamp');
  return [...sp.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
}
function pathOf(s) { const i = s.indexOf('?'); return i === -1 ? s : s.slice(0, i); }
function keyOf(method, pathAndQuery, bodySig) {
  const q = strip(pathAndQuery);
  return method + ' ' + pathOf(pathAndQuery) + (q ? '?' + q : '') + (bodySig ? ' #' + bodySig : '');
}

/* ---------- table ---------- */

let TABLE = null;

async function table() {
  if (TABLE) return TABLE;
  const c = await caches.open(CACHE);
  const r = await c.match('/__api/index.json');
  const idx = r ? await r.json() : {};
  const exact = {}, noBody = {}, byPath = {}, anyPath = {};
  for (const [k, v] of Object.entries(idx)) {
    const sp = k.indexOf(' ');
    const method = k.slice(0, sp);
    let rest = k.slice(sp + 1);
    let bodySig = '';
    const hi = rest.lastIndexOf(' #');
    if (hi !== -1) { bodySig = rest.slice(hi + 2); rest = rest.slice(0, hi); }

    const ek = keyOf(method, rest, bodySig);
    if (!exact[ek]) exact[ek] = v;
    const nk = keyOf(method, rest, '');
    if (!noBody[nk]) noBody[nk] = v;
    const pk = method + ' ' + pathOf(rest);
    if (!byPath[pk]) byPath[pk] = v;
    const ap = pathOf(rest);
    if (!anyPath[ap]) anyPath[ap] = v;
  }
  TABLE = { exact, noBody, byPath, anyPath };
  return TABLE;
}

/* The fallback must satisfy the specific destructuring of each Frappe caller.
 * Notably `frappe.views.pageview.with_page` does `r.docs._dynamic_page`, so any
 * endpoint whose caller expects `docs` as an OBJECT must not receive null/[].
 * An empty object is the safe reply: the desk proceeds and silently shows the
 * page as empty instead of throwing. */
function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Demo-Fallback': '1',   // lets the audit script list un-recorded endpoints
    },
  });
}

function fallbackFor(pathname) {
  const p = pathname.toLowerCase();
  if (/desk_page\.getpage|desk_page\.get|\.getpage/.test(p)) return json({ docs: {} });
  if (/getdoc\b|\/api\/resource\//.test(p)) return json({ docs: [] });
  if (/get_count/.test(p)) return json({ message: 0 });
  if (/get_list|get_all|get_script|reportview\.get\b|query_report|search_link|search\.link/.test(p))
    return json({ message: [] });
  if (/get_value|get_single_value/.test(p)) return json({ message: null });
  // Generic: keep every commonly-destructured key present (object-shaped) so no
  // caller can hit `Cannot read properties of undefined`.
  return json({ message: {}, docs: {}, _link_titles: {}, exc: null });
}

async function replay(req) {
  const u = new URL(req.url);
  try {
    let bodySig = '';
    if (req.method === 'POST') {
      try { bodySig = bh(normBody(await req.clone().text())); } catch (e) {}
    }
    const pq = u.pathname + u.search;
    const t = await table();
    const entry =
      t.exact[keyOf(req.method, pq, bodySig)] ||
      t.noBody[keyOf(req.method, pq, '')] ||
      t.byPath[req.method + ' ' + u.pathname] ||
      t.anyPath[u.pathname];
    if (!entry) return fallbackFor(u.pathname);
    const c = await caches.open(CACHE);
    const hit = await c.match('/__api/' + entry.file);
    if (!hit) return fallbackFor(u.pathname);
    return new Response(await hit.blob(), {
      status: entry.status || 200,
      headers: { 'Content-Type': entry.ct || 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return fallbackFor(u.pathname);
  }
}

/* ---------- routing ---------- */

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then((c) => c.match(SHELL)).then((r) => r || fetch(req)));
    return;
  }

  const p = u.pathname;
  if (p.startsWith('/api/') || p.startsWith('/desk/')) { e.respondWith(replay(req)); return; }

  // Realtime is impossible offline. Answer socket.io cleanly instead of letting
  // the generic branch below hand it the HTML shell.
  if (p.startsWith('/socket.io')) {
    e.respondWith(new Response('', { status: 404, statusText: 'demo: realtime disabled' }));
    return;
  }

  // Everything else: cache first, then network. NEVER answer a non-navigation
  // request with the HTML shell — that fed socket.io a 3.5 MB HTML document and
  // produced `Cannot read properties of undefined (reading 'responseText')`.
  e.respondWith(
    caches.open(CACHE)
      .then((c) => c.match(p).then((hit) => hit || c.match(req)))
      .then((hit) => hit || fetch(req))
      .catch(() => new Response('', { status: 504, statusText: 'demo: offline' }))
  );
});
