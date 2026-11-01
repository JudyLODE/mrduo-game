/* 第一案的場景背景、台灣地圖、旅行動畫、預告信。 */
"use strict";
/* ================= common art ================= */
const cloud=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="#FFFFFF"><ellipse cx="0" cy="0" rx="60" ry="28"/><ellipse cx="-40" cy="8" rx="38" ry="22"/><ellipse cx="44" cy="8" rx="40" ry="22"/><ellipse cx="10" cy="-18" rx="36" ry="26"/></g>`;
const t101=(x,y,s=1,c='#98B1CB')=>{let p='';for(let k=0;k<8;k++){const yy=y-60*s-k*26*s;p+=`<path d="M${x-22*s} ${yy} L${x+22*s} ${yy} L${x+27*s} ${yy-26*s} L${x-27*s} ${yy-26*s}Z" fill="${c}"/>`}return `<rect x="${x-30*s}" y="${y-60*s}" width="${60*s}" height="${60*s}" fill="${c}"/>`+p+`<rect x="${x-10*s}" y="${y-60*s-8*26*s-20*s}" width="${20*s}" height="${20*s}" fill="${c}"/><rect x="${x-2*s}" y="${y-60*s-8*26*s-60*s}" width="${4*s}" height="${42*s}" fill="${c}"/>`};

/* ---------- OFFICE ---------- */
function bgOffice(){return `
<rect width="1600" height="1000" fill="#EAD9B5"/>
<rect y="0" width="1600" height="40" fill="#DCC69B"/>

<rect y="620" width="1600" height="150" fill="#8FA9C2"/><rect y="612" width="1600" height="14" fill="#7893AE"/>
<rect y="770" width="1600" height="230" fill="#BF9B6E"/>
<g stroke="#B18859" stroke-width="4">${Array.from({length:9},(_,i)=>`<line x1="${i*200}" y1="770" x2="${i*200-80}" y2="1000"/>`).join('')}</g>
<ellipse cx="760" cy="900" rx="420" ry="70" fill="#C86062"/><ellipse cx="760" cy="900" rx="360" ry="52" fill="none" stroke="#D4BB49" stroke-width="8" stroke-dasharray="20 14"/>
<g transform="translate(960 110)"><rect width="460" height="420" rx="24" fill="#FFFFFF" stroke="#2E384F" stroke-width="8"/>
<rect x="18" y="18" width="424" height="384" rx="14" fill="#92C3DB"/>
${cloud(110,90,.8)}${cloud(330,60,.6)}
<g fill="#8CA1B8">${t101(250,402,1.15,'#8CA1B8')}<rect x="40" y="300" width="70" height="102"/><rect x="120" y="330" width="60" height="72"/><rect x="320" y="290" width="80" height="112"/><rect x="400" y="340" width="40" height="62"/></g>
<g stroke="#FFFFFF" stroke-width="3" opacity=".7">${Array.from({length:18},(_,i)=>`<line x1="${30+i*24}" y1="${30+(i*53)%300}" x2="${22+i*24}" y2="${54+(i*53)%300}"/>`).join('')}</g>
<rect x="222" y="18" width="16" height="384" fill="#FFFFFF"/><rect x="18" y="200" width="424" height="14" fill="#FFFFFF"/></g>
<g transform="translate(110 130)"><rect width="460" height="330" rx="18" fill="#C7A685" stroke="#2E384F" stroke-width="8"/><rect x="18" y="18" width="424" height="294" rx="10" fill="#D9BF9E"/>
<rect x="44" y="44" width="110" height="80" fill="#FFFFFF" transform="rotate(-4 99 84)"/><rect x="58" y="56" width="82" height="56" fill="#92C3DB" transform="rotate(-4 99 84)"/>
<rect x="190" y="40" width="96" height="96" fill="#F2EEC9" transform="rotate(3 238 88)"/><text x="238" y="98" text-anchor="middle" font-size="34" font-weight="900" fill="#2E384F">？</text>
<rect x="310" y="56" width="104" height="78" fill="#FFFFFF" transform="rotate(5 362 95)"/><path d="M330 120 l20 -30 l18 22 l12 -14 l24 22z" fill="#8DB36E" transform="rotate(5 362 95)"/>
<rect x="80" y="170" width="120" height="100" fill="#E5D490" transform="rotate(4 140 220)"/><text x="140" y="232" text-anchor="middle" font-size="40" font-weight="900" fill="#7E5FA3" font-family="Fredoka">X</text>
<rect x="250" y="176" width="150" height="96" fill="#FFFFFF" transform="rotate(-3 325 224)"/>
<path d="M99 84 L238 88 L362 95 L140 220 L325 224" fill="none" stroke="#C86062" stroke-width="4"/>
${[[99,64],[238,50],[362,70],[140,180],[325,190]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#C86062" stroke="#2E384F" stroke-width="3"/>`).join('')}</g>
<g transform="translate(560 560)"><rect x="0" y="50" width="520" height="40" rx="10" fill="#A17856" stroke="#2E384F" stroke-width="6"/><rect x="20" y="88" width="40" height="150" fill="#90694A"/><rect x="460" y="88" width="40" height="150" fill="#90694A"/>
<rect x="300" y="-10" width="150" height="64" rx="8" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/><rect x="314" y="2" width="122" height="40" fill="#EAD9B5"/>
<path d="M120 50 v-40 a28 28 0 0 1 56 0 v40z" fill="#F0E7D9" stroke="#2E384F" stroke-width="5"/><path d="M176 18 q24 4 0 26" fill="none" stroke="#2E384F" stroke-width="5"/>
<path class="twinkle" d="M138 -20 q-10 -16 0 -32 M158 -24 q-10 -16 0 -32" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
<g transform="translate(40 50)"><rect x="-6" y="-86" width="12" height="86" fill="#2E384F"/><path d="M-30 -86 h60 l-16 -40 h-28z" fill="#D4BB49" stroke="#2E384F" stroke-width="5"/></g></g>
<g transform="translate(1450 330)"><rect width="140" height="440" rx="10" fill="#C86062" stroke="#2E384F" stroke-width="8"/><rect x="34" y="250" width="72" height="14" rx="7" fill="#2E384F"/><circle cx="114" cy="230" r="10" fill="#D4BB49" stroke="#2E384F" stroke-width="4"/><rect x="24" y="40" width="92" height="160" rx="10" fill="#BB4A4C"/></g>
<g transform="translate(1340 780)"><path d="M-40 0 h80 l-12 -70 h-56z" fill="#C86062" stroke="#2E384F" stroke-width="6"/>${[-60,-30,0,30,60].map(a=>`<ellipse cx="0" cy="-110" rx="16" ry="56" fill="#76A960" stroke="#2E384F" stroke-width="4" transform="rotate(${a} 0 -70)"/>`).join('')}</g>
<g transform="translate(70 360)"><rect x="-6" width="12" height="410" fill="#90694A"/><circle cy="0" r="16" fill="#90694A"/><rect x="-60" y="420" width="120" height="14" rx="7" fill="#90694A"/>
<path d="M-8 30 q-50 10 -60 90 l24 4 q8 -60 44 -70z" fill="#C86062"/></g>
<rect x="590" y="44" width="420" height="64" rx="12" fill="#D4BB49" stroke="#2E384F" stroke-width="6"/><text x="800" y="90" text-anchor="middle" font-size="40" font-weight="900" fill="#2E384F">多叔偵探事務所</text>`}

/* ---------- 101 OBSERVATORY ---------- */
function bgObs(){return `

<rect width="1600" height="1000" fill="#2B79B5"/>
<rect x="0" y="40" width="1600" height="560" fill="#92C3DB"/>
${cloud(220,140,.9)}${cloud(760,110,.7)}${cloud(1300,170,1)}
<path d="M0 470 Q200 400 380 450 Q560 380 760 440 Q980 390 1180 450 Q1400 400 1600 440 V600 H0Z" fill="#8DB36E"/>
<path d="M0 520 Q300 490 600 520 T1200 515 T1600 520 V600 H0Z" fill="#8DB36E"/>
<path d="M0 560 Q400 530 820 565 T1600 555 V600 H0Z" fill="#599EC4"/>
<g fill="#C6D2E0">${[[60,40],[140,60],[230,30],[330,70],[420,45],[600,55],[700,35],[880,60],[980,40],[1080,70],[1200,45],[1300,60],[1420,35],[1520,55]].map(([x,h])=>`<rect x="${x}" y="${560-h}" width="${50}" height="${h}" rx="4"/>`).join('')}</g>
<g fill="#2B79B5">${[0,200,400,600,800,1000,1200,1400,1600].map(x=>`<rect x="${x-14}" y="40" width="28" height="560"/>`).join('')}</g>
<rect y="0" width="1600" height="52" fill="#235278"/><rect y="590" width="1600" height="24" fill="#235278"/>
<rect y="614" width="1600" height="386" fill="#EBEAE4"/>
<g stroke="#D8D4CB" stroke-width="4">${Array.from({length:9},(_,i)=>`<line x1="${i*200}" y1="614" x2="${i*200-120}" y2="1000"/>`).join('')}<line x1="0" y1="760" x2="1600" y2="760"/><line x1="0" y1="880" x2="1600" y2="880"/></g>
<g transform="translate(390 0)"><g stroke="#948865" stroke-width="8">${[-110,-50,50,110].map(x=>`<line x1="${x}" y1="52" x2="${x*.5}" y2="460"/>`).join('')}</g>
<circle cx="0" cy="560" r="160" fill="#D8BD7E" stroke="#2E384F" stroke-width="8"/><ellipse cx="-50" cy="500" rx="50" ry="34" fill="#EEDFB5"/>
<path d="M-158 560 H158" stroke="#B89D5E" stroke-width="10"/><rect x="-190" y="700" width="380" height="20" rx="10" fill="#C4C0D4" stroke="#2E384F" stroke-width="5"/>
${[-170,-100,-30,40,110,170].map(x=>`<rect x="${x-5}" y="700" width="10" height="90" fill="#C4C0D4"/>`).join('')}
<rect x="-110" y="790" width="220" height="44" rx="12" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/><text y="822" text-anchor="middle" font-size="26" font-weight="900" fill="#2E384F">風阻尼器</text></g>
<g transform="translate(1250 230)"><rect width="270" height="510" rx="14" fill="#C8B482" stroke="#2E384F" stroke-width="8"/><rect x="18" y="60" width="112" height="440" fill="#E0CE9F"/><rect x="140" y="60" width="112" height="440" fill="#E0CE9F"/><rect x="18" y="10" width="234" height="40" rx="8" fill="#2E384F"/><text x="135" y="40" text-anchor="middle" font-size="26" font-weight="900" fill="#D4BB49" font-family="Fredoka">89 ▲ 101</text></g>
<g transform="translate(760 560)"><rect width="380" height="220" rx="12" fill="#C86062" stroke="#2E384F" stroke-width="7"/><rect y="-160" width="380" height="18" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/><rect y="-80" width="380" height="18" fill="#FFFFFF" stroke="#2E384F" stroke-width="5"/>
${[30,90,150,210,270,330].map((x,i)=>`<g fill="${['#98B1CB','#8DB36E','#D4BB49'][i%3]}">${t101(x,-160,.18,['#98B1CB','#8DB36E','#D4BB49'][i%3])}</g>`).join('')}
${[40,110,180,250,320].map((x,i)=>`<rect x="${x}" y="-130" width="44" height="50" rx="6" fill="${['#D4BB49','#8DB36E','#7E5FA3','#C86062','#2B79B5'][i]}"/>`).join('')}
<rect x="20" y="20" width="340" height="40" rx="10" fill="#FFFFFF"/><text x="190" y="50" text-anchor="middle" font-size="26" font-weight="900" fill="#2E384F">101 紀念品店</text></g>
<g transform="translate(560 780)"><rect width="220" height="26" rx="12" fill="#A17856" stroke="#2E384F" stroke-width="5"/><rect x="20" y="24" width="18" height="60" fill="#90694A"/><rect x="182" y="24" width="18" height="60" fill="#90694A"/></g>
<g transform="translate(150 640)"><rect x="-8" y="40" width="16" height="200" fill="#636C86"/><rect x="-50" y="230" width="100" height="18" rx="8" fill="#636C86"/><rect x="-70" y="-10" width="120" height="56" rx="26" fill="#7E5FA3" stroke="#2E384F" stroke-width="6" transform="rotate(-18 -10 18)"/><circle cx="-58" cy="36" r="20" fill="#2E384F"/></g>
<g transform="translate(1530 860)"><path d="M-46 0 h92 l-14 -76 h-64z" fill="#D4BB49" stroke="#2E384F" stroke-width="6"/>${[-50,-20,10,40].map(a=>`<ellipse cx="0" cy="-130" rx="20" ry="60" fill="#76A960" stroke="#2E384F" stroke-width="4" transform="rotate(${a} 0 -76)"/>`).join('')}</g>
<g transform="translate(650 52)"><line x1="0" y1="0" x2="0" y2="60" stroke="#2E384F" stroke-width="5"/><path d="M-50 100 Q0 40 50 100Z" fill="#D4BB49" stroke="#2E384F" stroke-width="5"/></g>`}

/* ---------- SUN MOON LAKE ---------- */
function bgLake(){return `

<rect width="1600" height="1000" fill="#92C3DB"/>
<circle cx="1360" cy="130" r="64" fill="#D4BB49"/><circle cx="1360" cy="130" r="88" fill="#D4BB49" opacity=".3"/>
${cloud(300,110,.9)}${cloud(900,80,.7)}
<path d="M0 360 Q160 200 330 300 Q470 180 640 290 Q820 170 1000 290 Q1180 200 1340 300 Q1480 230 1600 300 V480 H0Z" fill="#76A960"/>
<path d="M0 420 Q220 300 460 400 Q700 310 940 410 Q1200 320 1600 400 V480 H0Z" fill="#59944E"/>
<g transform="translate(1180 300)"><rect x="-10" y="-10" width="20" height="90" fill="#EAE2D2"/><path d="M-30 -10 h60 l-30 -40z" fill="#C86062"/><path d="M-24 30 h48 l-24 -28z" fill="#C86062"/><path d="M-26 70 h52 l-26 -30z" fill="#C86062"/></g>
<rect y="460" width="1600" height="540" fill="#599EC4"/>
<g stroke="#ABD0E4" stroke-width="5" fill="none" stroke-linecap="round">${Array.from({length:22},(_,i)=>`<path d="M${(i*157)%1560} ${500+(i*61)%460} q20 -10 40 0 t40 0"/>`).join('')}</g>
<path d="M600 460 h220 l-40 30 h-140z" fill="#FFFFFF" opacity=".4"/>
<g transform="translate(0 690)"><rect width="980" height="40" fill="#BB9A7A" stroke="#2E384F" stroke-width="6"/><rect y="38" width="980" height="22" fill="#A8815F"/>
${[40,240,440,640,840].map(x=>`<rect x="${x}" y="58" width="26" height="160" fill="#936F52"/>`).join('')}
<g stroke="#A8815F" stroke-width="3">${Array.from({length:24},(_,i)=>`<line x1="${i*42}" y1="0" x2="${i*42}" y2="40"/>`).join('')}</g></g>
<g transform="translate(1010 560)"><path d="M0 60 Q20 140 120 150 H380 Q450 140 470 60Z" fill="#FFFFFF" stroke="#2E384F" stroke-width="7"/><rect x="0" y="80" width="470" height="18" fill="#C86062"/>
<rect x="110" y="-40" width="250" height="100" rx="16" fill="#F7F0DE" stroke="#2E384F" stroke-width="6"/>${[140,210,280].map(x=>`<rect x="${x}" y="-20" width="44" height="40" rx="8" fill="#92C3DB"/>`).join('')}
<text x="235" y="128" text-anchor="middle" font-size="30" font-weight="900" fill="#2E384F">日月號</text></g>
<g transform="translate(250 560)"><rect x="-10" y="0" width="240" height="130" rx="10" fill="#D4BB49" stroke="#2E384F" stroke-width="6"/><path d="M-30 0 h280 l-20 -50 h-240z" fill="#C86062" stroke="#2E384F" stroke-width="6"/>${[0,60,120,180].map(x=>`<path d="M${x-20} 0 h40 l-6 -50 h-28z" fill="#FFFFFF" opacity=".6"/>`).join('')}
<text x="110" y="80" text-anchor="middle" font-size="30" font-weight="900" fill="#2E384F">茶葉蛋</text><ellipse cx="60" cy="108" rx="40" ry="10" fill="#A17856"/></g>
<g transform="translate(120 140)"><path d="M0 560 Q-14 300 10 0 H50 Q70 300 60 560Z" fill="#936F52" stroke="#2E384F" stroke-width="6"/><path d="M30 120 Q120 100 200 130" stroke="#936F52" stroke-width="22" fill="none" stroke-linecap="round"/>
<circle cx="30" cy="-20" r="110" fill="#76A960"/><circle cx="-60" cy="40" r="80" fill="#8DB36E"/><circle cx="120" cy="30" r="90" fill="#59944E"/></g>
<g transform="translate(40 700)">${Array.from({length:14},(_,i)=>`<path d="M${i*16} 40 q-6 -${80+(i%3)*30} ${10+(i%2)*14} -${120+(i%4)*20}" stroke="#59944E" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>
<g transform="translate(1460 820)"><ellipse rx="120" ry="60" fill="#A7AFBC" stroke="#2E384F" stroke-width="6"/><ellipse cx="-40" cy="-20" rx="40" ry="16" fill="#A7B0BE"/></g>
<g stroke="#2E384F" stroke-width="3">${Array.from({length:8},(_,i)=>`<line x1="${i*130}" y1="${600+(i%2)*12}" x2="${i*130+130}" y2="${600+((i+1)%2)*12}"/>`).join('')}</g>
${Array.from({length:8},(_,i)=>`<g transform="translate(${i*130+65} ${612})"><ellipse rx="16" ry="20" fill="${['#C86062','#D4BB49'][i%2]}" stroke="#2E384F" stroke-width="3"/></g>`).join('')}`}

/* ---------- ANPING ---------- */
function bgFort(){return `

<rect width="1600" height="1000" fill="#92C3DB"/>
${cloud(220,120,.8)}${cloud(1100,90,.7)}
<g transform="translate(800 0)"><rect x="-120" y="150" width="240" height="250" fill="#FFFFFF" stroke="#2E384F" stroke-width="7"/><path d="M-150 160 L0 70 L150 160Z" fill="#CE7F71" stroke="#2E384F" stroke-width="7"/><rect x="-60" y="40" width="120" height="40" fill="#FFFFFF" stroke="#2E384F" stroke-width="6"/><path d="M-80 46 L0 0 L80 46Z" fill="#CE7F71" stroke="#2E384F" stroke-width="6"/>
${[-70,0,70].map(x=>`<rect x="${x-22}" y="210" width="44" height="64" rx="22" fill="#92C3DB" stroke="#2E384F" stroke-width="4"/>`).join('')}<rect x="-6" y="-30" width="6" height="34" fill="#2E384F"/><path d="M0 -30 l40 12 l-40 12z" fill="#7E5FA3"/></g>
<rect x="80" y="390" width="1440" height="380" fill="#B87F6D" stroke="#2E384F" stroke-width="7"/>
<g fill="#B87F6D" stroke="#2E384F" stroke-width="6">${Array.from({length:15},(_,i)=>`<rect x="${90+i*96}" y="350" width="60" height="46"/>`).join('')}</g>
<g stroke="#A96551" stroke-width="4">${[440,490,540,590,640,690,740].map(y=>`<line x1="84" y1="${y}" x2="1516" y2="${y}"/>`).join('')}${Array.from({length:30},(_,i)=>`<line x1="${100+i*48+((i%2)*24)}" y1="${440+(i%7)*50}" x2="${100+i*48+((i%2)*24)}" y2="${490+(i%7)*50}"/>`).join('')}</g>
<path d="M0 760 H1600 V1000 H0Z" fill="#D8C29B"/><path d="M0 760 Q800 820 1600 760" fill="#C9B085"/>
<g stroke="#BDA479" stroke-width="5">${Array.from({length:12},(_,i)=>`<line x1="${i*140}" y1="840" x2="${i*140+60}" y2="840"/><line x1="${i*140+70}" y1="920" x2="${i*140+130}" y2="920"/>`).join('')}</g>
<g transform="translate(300 740)"><rect x="-60" y="-14" width="120" height="30" rx="14" fill="#6E5D50"/><path d="M-30 -10 L100 -40 L104 -20 L-24 14Z" fill="#494952" stroke="#2E384F" stroke-width="5"/><circle cx="-36" cy="18" r="26" fill="#936F52" stroke="#2E384F" stroke-width="5"/><circle cx="-36" cy="18" r="8" fill="#2E384F"/><circle cx="120" cy="30" r="14" fill="#494952"/><circle cx="146" cy="34" r="14" fill="#494952"/></g>
<g transform="translate(1480 200)"><path d="M-40 560 Q-60 300 -10 140 H50 Q80 300 70 560Z" fill="#947C65" stroke="#2E384F" stroke-width="6"/>${[-60,-30,20,60,90].map(x=>`<path d="M${x} 560 q-${10+Math.abs(x)/6} -200 ${x>0?20:-10} -300" stroke="#947C65" stroke-width="10" fill="none"/>`).join('')}
<circle cx="0" cy="90" r="140" fill="#76A960"/><circle cx="-100" cy="150" r="100" fill="#8DB36E"/><circle cx="90" cy="170" r="90" fill="#59944E"/></g>
<g transform="translate(1250 640)"><rect x="-20" y="0" width="260" height="140" rx="10" fill="#D29841" stroke="#2E384F" stroke-width="6"/><path d="M-40 0 h300 l-20 -46 h-260z" fill="#2B79B5" stroke="#2E384F" stroke-width="6"/><text x="110" y="70" text-anchor="middle" font-size="32" font-weight="900" fill="#2E384F">蝦捲・豆花</text></g>`}
const signPost=(x,y,n)=>`<g transform="translate(${x} ${y})"><rect x="-8" y="0" width="16" height="140" fill="#876145"/><rect x="-90" y="-80" width="180" height="90" rx="10" fill="#9F7757" stroke="#2E384F" stroke-width="6"/><rect x="-80" y="-70" width="160" height="70" rx="6" fill="#F7EFDE"/><text y="-26" text-anchor="middle" font-size="30" font-weight="900" fill="#3E2E20">告示牌 ${n}</text></g>`;
function bgStreet(){let s=`<rect width="1600" height="1000" fill="#92C3DB"/>`;
  const cols=['#C86062','#D4BB49','#92C3DB','#2B79B5','#8DB36E','#7E5FA3'];
  for(let i=0;i<6;i++){const x=i*270;s+=`<g transform="translate(${x} 80)"><rect width="260" height="420" fill="${cols[i]}" stroke="#2E384F" stroke-width="6"/><path d="M-10 0 h280 l-20 -50 h-240z" fill="#B87F6D" stroke="#2E384F" stroke-width="6"/><rect x="40" y="70" width="70" height="90" rx="35" fill="#F7F0DE" stroke="#2E384F" stroke-width="4"/><rect x="150" y="70" width="70" height="90" rx="35" fill="#F7F0DE" stroke="#2E384F" stroke-width="4"/><rect x="70" y="240" width="120" height="180" fill="#936F52" stroke="#2E384F" stroke-width="4"/><rect x="30" y="190" width="200" height="34" rx="6" fill="#FFFFFF" stroke="#2E384F" stroke-width="4"/></g>`}
  s+=`<path d="M0 60 Q400 120 800 60 T1600 60" stroke="#2E384F" stroke-width="3" fill="none"/>`+Array.from({length:12},(_,i)=>`<ellipse cx="${60+i*136}" cy="${88+Math.sin(i)*14}" rx="18" ry="24" fill="#C86062" stroke="#2E384F" stroke-width="3"/>`).join('');
  s+=`<rect y="500" width="1600" height="500" fill="#D8C29B"/><g stroke="#C9B085" stroke-width="4">${Array.from({length:10},(_,i)=>`<line x1="${i*170}" y1="500" x2="${i*170-100}" y2="1000"/>`).join('')}</g>`;
  return s}

/* ---------- MAP ---------- */
const P=(lon,lat)=>[(lon-119.3)*220,(25.45-lat)*240];
const PLACES={
 t101:{n:'台北101',c:[121.565,25.034],city:'台北市',f:'台北101 高 508 公尺，曾經是世界最高的大樓，外型像一節一節的竹子。'},
 yeliu:{n:'野柳',c:[121.69,25.21],city:'新北市',f:'野柳地質公園在北海岸，有一塊像女王頭的奇特石頭。'},
 taroko:{n:'太魯閣',c:[121.52,24.17],city:'花蓮縣',f:'太魯閣的溪水切開大理石，形成又深又窄的峽谷。'},
 sml:{n:'日月潭',c:[120.91,23.86],city:'南投縣',f:'日月潭是台灣最大的天然湖泊，邵族人世代住在湖邊。'},
 alishan:{n:'阿里山',c:[120.80,23.51],city:'嘉義縣',f:'阿里山可以看日出和雲海，還能搭森林小火車。'},
 anping:{n:'安平古堡',c:[120.16,23.00],city:'台南市',f:'安平古堡大約四百年前由荷蘭人建造；台南是台灣最古老的城市。'},
 kenting:{n:'墾丁',c:[120.80,21.96],city:'屏東縣',f:'墾丁在台灣最南端，有美麗的海灘和珊瑚礁。'},
 penghu:{n:'澎湖',c:[119.58,23.57],city:'澎湖縣',f:'澎湖是台灣海峽中間的群島，有愛心形狀的「雙心石滬」。'}
};
const OUT=[[121.51,25.30],[121.60,25.29],[121.74,25.16],[121.86,25.13],[122.00,25.01],[121.86,24.86],[121.82,24.62],[121.85,24.50],[121.70,24.25],[121.62,24.00],[121.55,23.70],[121.45,23.40],[121.38,23.10],[121.18,22.80],[121.00,22.60],[120.90,22.35],[120.86,22.10],[120.84,21.90],[120.74,21.95],[120.70,22.10],[120.60,22.30],[120.47,22.46],[120.30,22.55],[120.25,22.70],[120.15,22.95],[120.10,23.10],[120.12,23.35],[120.15,23.60],[120.20,23.80],[120.30,24.05],[120.45,24.25],[120.62,24.48],[120.75,24.65],[120.90,24.85],[121.02,25.02],[121.20,25.10],[121.40,25.18]];
function smooth(pts){const p=pts.map(([a,b])=>P(a,b));const m=i=>{const a=p[i%p.length],b=p[(i+1)%p.length];return[(a[0]+b[0])/2,(a[1]+b[1])/2]};let d=`M${m(0)}`;for(let i=1;i<=p.length;i++)d+=` Q${p[i%p.length]} ${m(i)}`;return d+'Z'}
let ROUTE=['t101','sml','anping'];
function mapSvg(showNames,done){
  let s=`<rect width="620" height="880" fill="#92C3DB"/>
  <g stroke="#ABD0E4" stroke-width="3" fill="none">${Array.from({length:30},(_,i)=>`<path d="M${(i*97)%600} ${(i*131)%860} q12 -8 24 0 t24 0"/>`).join('')}</g>
  <path d="${smooth(OUT)}" fill="#E5D090" stroke="#BD9E4C" stroke-width="6" stroke-linejoin="round"/>
  <path d="M470 150 Q430 300 390 420 Q360 520 330 640" fill="none" stroke="#8DB36E" stroke-width="26" stroke-linecap="round"/>
  ${[[460,190],[430,290],[400,380],[375,470],[350,560]].map(([x,y])=>`<path d="M${x-22} ${y+14} L${x} ${y-20} L${x+22} ${y+14}Z" fill="#76A960"/>`).join('')}
  <g fill="#E5D090" stroke="#BD9E4C" stroke-width="4"><ellipse cx="58" cy="448" rx="16" ry="22"/><ellipse cx="40" cy="480" rx="7" ry="9"/><ellipse cx="78" cy="420" rx="6" ry="8"/></g>
  <text x="250" y="60" fill="#2B79B5" font-size="24" font-weight="900" letter-spacing="6">台灣海峽</text>
  <text x="560" y="520" fill="#2B79B5" font-size="24" font-weight="900" writing-mode="tb" letter-spacing="6">太平洋</text>`;
  const pts=ROUTE.slice(0,done).map(k=>P(...PLACES[k].c));
  if(pts.length>1)s+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#C86062" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>`;
  for(const k in PLACES){const [x,y]=P(...PLACES[k].c);const ok=ROUTE.indexOf(k)>-1&&ROUTE.indexOf(k)<done;
    const right=x>420&&k!=='penghu';
    s+=`<g class="pin" data-k="${k}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="30" fill="transparent"/>
    ${ok?`<circle cx="${x}" cy="${y}" r="18" fill="#50A260" stroke="#fff" stroke-width="4"/><path d="M${x-8} ${y} l5 6 l10 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`
        :`<path d="M${x} ${y+4} c-16 -18 -18 -26 -18 -32 a18 18 0 0 1 36 0 c0 6 -2 14 -18 32z" fill="#C86062" stroke="#2E384F" stroke-width="4"/><circle cx="${x}" cy="${y-28}" r="6" fill="#fff"/>`}
    ${(showNames||ok)?`<text x="${right?x-24:x+24}" y="${y-8}" text-anchor="${right?'end':'start'}" font-size="22" font-weight="900" fill="#2E384F" paint-order="stroke" stroke="#FFFFFF" stroke-width="7">${PLACES[k].n}</text>`:''}</g>`}
  return s;
}
function mapPick(target,done){
  return new Promise(res=>{
    modal(`<div class="card" data-duo="think" style="width:min(1000px,100%)"><div class="mgrid" style="align-items:center">
      <svg viewBox="0 0 620 880" style="width:100%;max-height:66vh" id="mapS">${mapSvg(!hard(),done)}</svg>
      <div><h3>怪盜X會去哪裡？</h3><p class="lead">想想預告信的線索，在地圖上點一個地點。（地圖上沒有寫地名，點一點地標就會告訴你是哪裡！）</p>
      <div id="mapInfo" class="story">還沒選地點。</div><div class="row" style="margin-top:12px"><button class="btn c" id="mapGo" disabled>就是這裡！</button></div><div class="fb no" id="mapFb"></div></div></div></div>`,b=>{
      let pick=null;
      b.querySelector('#mapS').onclick=e=>{const g=e.target.closest('.pin');if(!g)return;pick=g.dataset.k;const pl=PLACES[pick];sPop();
        b.querySelector('#mapInfo').innerHTML=`<b style="font-size:24px">${pl.n}</b>（${pl.city}）<br>${pl.f}`;b.querySelector('#mapGo').disabled=false;b.querySelector('#mapFb').textContent=''};
      b.querySelector('#mapGo').onclick=()=>{if(!pick)return;
        if(pick===target){sGood();addFact(PLACES[pick].f);closeModal();res()}
        else{sBad();b.querySelector('#mapFb').textContent=`多叔：「${PLACES[pick].n}很美，但跟預告信說的不一樣喔。再讀讀看線索！」`;shake(b.querySelector('.card'))}};
    });
  });
}
function travel(from,to){
  return new Promise(res=>{
    const [x1,y1]=from?P(...PLACES[from].c):[480,120],[x2,y2]=P(...PLACES[to].c);
    modal(`<div class="card" style="width:min(560px,100%);text-align:center"><h3>出發！前往${PLACES[to].n}</h3>
      <svg viewBox="0 -150 620 1030" style="width:100%;max-height:68vh">${mapSvg(true,ROUTE.indexOf(to))}
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7E5FA3" stroke-width="7" stroke-dasharray="4 14" stroke-linecap="round"/>
      <image id="walker" href="${COAT.coat_pocket.b}" width="${Math.round(174*COAT.coat_pocket.r)}" height="174" x="${x1-59}" y="${y1-174}"/></svg></div>`,b=>{
      const w=b.querySelector('#walker');const t0=performance.now();const D=2200;tone([392,523,659,784],.12);
      const f=t=>{const k=Math.min((t-t0)/D,1);const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const x=x1+(x2-x1)*e,y=y1+(y2-y1)*e-Math.abs(Math.sin(k*Math.PI*8))*10;
        w.setAttribute('x',x-59);w.setAttribute('y',y-174);
        if(k<1)requestAnimationFrame(f);else setTimeout(()=>{closeModal();res()},500)};requestAnimationFrame(f);
    });
  });
}

/* ================= letters ================= */
const LETTERS=[
 '致 偵探多叔：\n今晚，我要偷走一盞燈。\n它在台灣最高大樓的頂端，\n那棟大樓長得像一節一節的竹子，\n跨年的時候還會噴出煙火。\n抓得到我就來吧！\n　　　　　　　—— 怪盜X',
 '哈哈，燈太重，我不要了！\n下一站，我要搶走一艘遊船。\n那是台灣最大的天然湖泊，\n一半像太陽，一半像月亮。\n船上的密碼是英文的，你們解得開嗎？\n　　　　　　　—— 怪盜X',
 '可惡，連英文都難不倒你們！\n最後，我要拿走一座古堡的寶物。\n它在台灣最古老的城市，\n大約四百年前由荷蘭人建造，\n旁邊還有好吃的蝦捲和豆花。\n　　　　　　　—— 怪盜X'
];
function letter(i){return new Promise(res=>{const t=LETTERS[i];sBell();
  modal(`<div class="letter"><div class="seal">X</div><p>${t}</p><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn w" id="lSay">唸給我聽</button><button class="btn c" id="lOk">收好預告信</button></div></div>`,b=>{
    b.querySelector('#lSay').onclick=()=>speak(t.replace('—— ','').replace(/\n/g,'，'),'zh-TW');
    b.querySelector('#lOk').onclick=()=>{closeModal();res()};});})}
