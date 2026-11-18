/* GIS STGO - Exportador cartografico institucional v1.2 (2026-11-18) */
(function(){
'use strict';
if(window.GISSTGOExportador) return;
const AUTHOR='Subdirección de Planificación y Sustentabilidad - Oficina de Planificación Estratégica';
const SIZES={A5:[148,210],A4:[210,297],A3:[297,420],A2:[420,594],A1:[594,841],A0:[841,1189],Carta:[215.9,279.4],Oficio:[215.9,330.2]};
const css='#gs-print-open{position:fixed;right:18px;bottom:20px;z-index:2147481000;background:#173d50;color:#fff;border:0;border-radius:9px;padding:11px 16px;box-shadow:0 3px 14px #0005;font:600 13px Arial;cursor:pointer}#gs-print-modal{position:fixed;inset:0;background:#0009;z-index:2147482000;display:none;align-items:center;justify-content:center;font:14px Arial;color:#1d3444}#gs-print-modal.gs-open{display:flex}#gs-print-panel{width:min(520px,95vw);max-height:94vh;overflow:auto;background:#fff;border-radius:12px;padding:21px;box-shadow:0 12px 40px #0006}#gs-print-panel h2{margin:0 0 12px;font-size:20px}#gs-print-panel label{display:block;font-weight:600;margin:9px 0 3px}#gs-print-panel input,#gs-print-panel select,#gs-print-panel textarea{width:100%;padding:8px;border:1px solid #b7c7d0;border-radius:6px;font:13px Arial}#gs-print-panel textarea{height:80px;resize:vertical}#gs-print-panel .gs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}#gs-print-panel .gs-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}#gs-print-panel button{border:0;border-radius:7px;padding:9px 14px;cursor:pointer;background:#174f6b;color:white}#gs-print-panel button.gs-secondary{background:#e4e9eb;color:#263e48}#gs-print-status{margin-top:12px;font-size:12px;white-space:pre-wrap}';
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
function load(url,name){if(window[name])return Promise.resolve();return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>reject(new Error('No se pudo cargar '+name));document.head.appendChild(s)})}
function visible(e){const b=e.getBoundingClientRect();return b.width>100&&b.height>100&&getComputedStyle(e).visibility!=='hidden'}
function findMap(){const sels=['#map','.maplibregl-map','.mapboxgl-map','.leaflet-container','#mapa','#viewDiv','.esri-view-root'];for(const sel of sels){const el=[...document.querySelectorAll(sel)].find(visible);if(el)return el}return null}
function legend(){let nodes=[...document.querySelectorAll('.legend,.leyenda,#legend,#leyenda,.map-legend,.legend-items,.leaflet-control-layers')].filter(visible);const result=[];for(const el of nodes.slice(0,4)){let text=(el.innerText||'').trim().replace(/\n{3,}/g,'\n');if(text)result.push(text.slice(0,1100))}return result.join('\n').slice(0,2100)}
function colorFor(i){return ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666'][i%8]}
function e(id){return document.getElementById('gs-'+id)}
const open=document.createElement('button');open.id='gs-print-open';open.textContent='🖨 Imprimir / Descargar mapa';open.type='button';document.body.appendChild(open);
const overlay=document.createElement('div');overlay.id='gs-print-modal';overlay.innerHTML='<div id="gs-print-panel" role="dialog" aria-modal="true" aria-label="Exportación cartográfica"><h2>Layout cartográfico institucional</h2><div class="gs-grid"><div><label for="gs-size">Formato</label><select id="gs-size"><option>A4</option><option>A3</option><option>A2</option><option>A1</option><option>A0</option><option>A5</option><option>Carta</option><option>Oficio</option></select></div><div><label for="gs-orient">Orientación</label><select id="gs-orient"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></div><div><label for="gs-dpi">Resolución</label><select id="gs-dpi"><option>300</option><option>350</option><option>400</option><option>450</option><option>500</option></select></div><div><label for="gs-format">Salida</label><select id="gs-format"><option value="png">PNG</option><option value="pdf">PDF</option></select></div></div><label for="gs-title">Título del mapa</label><input id="gs-title"><label for="gs-field">Campo de desagregación</label><input id="gs-field" placeholder="Ej.: TIPO / BARRIO / TERRITORIO"><label for="gs-legend">Leyenda (una categoría por línea; opcional: categoría | #hex)</label><textarea id="gs-legend"></textarea><label for="gs-source">Fuente cartográfica</label><input id="gs-source" placeholder="Fuente de datos / año"><div class="gs-actions"><button id="gs-export" type="button">Generar archivo</button><button id="gs-cancel" class="gs-secondary" type="button">Cerrar</button></div><div id="gs-print-status" aria-live="polite"></div></div>';
document.body.appendChild(overlay);
open.onclick=()=>{e('title').value=document.title||'Mapa de Santiago';e('legend').value=legend();e('field').value='';e('source').value='Municipalidad de Santiago';e('print-modal').classList.add('gs-open')};
e('cancel').onclick=()=>e('print-modal').classList.remove('gs-open');
overlay.addEventListener('click',ev=>{if(ev.target===overlay)overlay.classList.remove('gs-open')});
function rect(canvas,x,y,w,h,c){canvas.fillStyle=c;canvas.fillRect(x,y,w,h)}
function line(canvas,x,y,txt,font,color,max){canvas.font=font;canvas.fillStyle=color;canvas.fillText(txt,x,y,max)}
async function capture(node,width){await load('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','html2canvas');return window.html2canvas(node,{useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,scale:Math.min(4,Math.max(1,width/Math.max(1,node.clientWidth)))})}
function parseLegend(value){return value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((x,i)=>{let p=x.split('|');return {title:p[0].trim(),color:/^#[a-f0-9]{6}$/i.test((p[1]||'').trim())?p[1].trim():colorFor(i)}})}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
async function exportMap(){
const status=e('print-status'),button=e('export');button.disabled=true;status.textContent='Preparando imagen cartográfica…';
try{
const map=findMap();if(!map)throw Error('No se encontró un mapa visible en esta página.');
const format=e('format').value,dpi=+e('dpi').value,sz=SIZES[e('size').value],hor=e('orient').value==='horizontal',mm=hor?[sz[1],sz[0]]:sz;
const w=Math.round(mm[0]*dpi/25.4),h=Math.round(mm[1]*dpi/25.4);
if(w*h>90000000)throw Error('Esta combinación excede 90 megapíxeles. Reduzca tamaño o resolución; para formatos grandes conviene un motor de exportación en servidor.');
const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');if(!g)throw Error('Memoria insuficiente para crear el documento');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
const k=dpi/25.4,m=12*k;rect(g,0,0,w,h,'#fff');rect(g,0,0,w,9*k,'#173b4f');line(g,m,6.3*k,'MUNICIPALIDAD DE SANTIAGO',String(Math.round(11*k))+'px Arial','#fff',w-2*m);
const title=e('title').value.trim()||'Mapa temático';line(g,m,17*k,title,'bold '+Math.round(5.6*k)+'px Arial','#1c394b',w-2*m);
const y=22*k,foot=23*k,sidebar=Math.min(56*k,w*0.25),mapW=w-2*m-sidebar-3*k,mapH=h-y-foot;
if(mapW<50||mapH<50)throw Error('Formato de página insuficiente');
const snap=await capture(map,Math.min(mapW,7500));rect(g,m,y,mapW,mapH,'#eef3f4');const ratio=Math.min(mapW/snap.width,mapH/snap.height),dw=snap.width*ratio,dh=snap.height*ratio;g.drawImage(snap,m+(mapW-dw)/2,y+(mapH-dh)/2,dw,dh);g.strokeStyle='#b2c3cb';g.lineWidth=Math.max(1,k*.2);g.strokeRect(m,y,mapW,mapH);
const sx=m+mapW+3*k;line(g,sx,y+5*k,'SIMBOLOGÍA','bold '+Math.round(3.3*k)+'px Arial','#173b4f',sidebar);
const field=e('field').value.trim();if(field)line(g,sx,y+10*k,field,Math.round(2.5*k)+'px Arial','#344b59',sidebar);
const items=parseLegend(e('legend').value);let cy=y+16*k;for(const it of items.slice(0,35)){if(cy>y+mapH-19*k)break;rect(g,sx,cy-2.5*k,3*k,3*k,it.color);line(g,sx+5*k,cy,it.title,Math.round(2.5*k)+'px Arial','#30434c',sidebar-6*k);cy+=5*k}
const northX=m+mapW-9*k,northY=y+12*k;g.fillStyle='#133d51';g.beginPath();g.moveTo(northX,northY-6*k);g.lineTo(northX-2.7*k,northY+3*k);g.lineTo(northX,northY+k);g.lineTo(northX+2.7*k,northY+3*k);g.closePath();g.fill();line(g,northX-1.7*k,northY-7*k,'N','bold '+Math.round(3.5*k)+'px Arial','#133d51',5*k);
let numericScale='Escala: referencial';try{const s=map.querySelector('.leaflet-control-scale-line,.maplibregl-ctrl-scale');if(s)numericScale='Escala gráfica: '+(s.textContent||'').trim()}catch(_){}
line(g,m,y+mapH+6*k,numericScale,Math.round(3*k)+'px Arial','#183748',mapW);
line(g,m,h-10*k,'Fuente: '+(e('source').value||'No especificada'),Math.round(2.7*k)+'px Arial','#344a55',w-2*m);
line(g,m,h-6*k,AUTHOR,Math.round(2.4*k)+'px Arial','#344a55',w-2*m);
line(g,m,h-2.5*k,'Layout creado: '+new Date().toLocaleString('es-CL')+' · '+e('size').value+' '+e('orient').value+' · '+dpi+' ppp',Math.round(2.2*k)+'px Arial','#344a55',w-2*m);
const name='Mapa_Santiago_'+new Date().toISOString().slice(0,10)+'_'+dpi+'ppp';
status.textContent='Generando '+format.toUpperCase()+' ('+w+' × '+h+' px)…';
if(format==='png'){await new Promise((ok,fail)=>cv.toBlob(b=>b? (download(b,name+'.png'),ok()):fail(Error('No se pudo codificar PNG')),'image/png'))}
else {await load('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','jspdf');const pdf=new window.jspdf.jsPDF({orientation:hor?'landscape':'portrait',unit:'mm',format:mm,compress:true});pdf.addImage(cv.toDataURL('image/jpeg',.92),'JPEG',0,0,mm[0],mm[1]);pdf.save(name+'.pdf')}
status.textContent='Archivo generado. Compruebe visualmente la cartografía, leyenda y escala antes de difusión. La resolución efectiva de las teselas depende del mapa de origen.';
}catch(err){status.textContent='No se pudo exportar: '+err.message}finally{button.disabled=false}
}
e('export').onclick=exportMap;
window.GISSTGOExportador={version:'1.2',open:()=>open.click(),findMap};
})();