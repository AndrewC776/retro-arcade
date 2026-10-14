// 根据文件名（romset / id / slug / 标题）匹配 META_DB 里的资料
(function(){
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/\.(zip|7z|swf|nes|gb|gbc|gba|sms|gg|md|gen|bin|sfc|smc|pce|a26|a78|lnx|ws|wsc|col|ngp|wad)$/,'').replace(/[\[(].*?[\])]/g,'').replace(/[^a-z0-9]/g,'');
let idx=null;
function build(){idx={};(window.META_DB||[]).forEach(m=>{[m.id,m.slug,m.title,m.aka].forEach(k=>{const n=norm(k);if(n&&!idx[n])idx[n]=m})})}
const EXT={nes:'nes',gb:'gb',gbc:'gbc',gba:'gba',sms:'sms',gg:'gg',md:'segaMD',gen:'segaMD',sfc:'snes',smc:'snes',pce:'pce',a26:'atari2600',a78:'atari7800',lnx:'lynx',ws:'ws',wsc:'ws',col:'coleco',ngp:'ngp',swf:'swf',wad:'doom'};
window.matchMeta=function(fileName){if(!idx)build();const base=String(fileName).split('/').pop();const ext=base.split('.').pop().toLowerCase();
  const m=idx[norm(base)]||null;let sys=EXT[ext]||null;
  if(ext==='zip'){const mame=(window.GAMES||[]).find(g=>g.system==='mame'&&g.file.split('/').pop().toLowerCase()===base.toLowerCase());sys=mame?'mame':(m&&m.core)||null}
  return {meta:m,system:sys,base}};
window.metaNorm=norm;
})();
