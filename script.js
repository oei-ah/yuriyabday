;(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  // ===== Cover Open + heart shower =====
  const cover = $('#cover');
  const gift = $('#gift');
  gift.addEventListener('click', () => {
    gift.classList.add('opened');
    setTimeout(()=>{cover.classList.add('fade')}, 650);
    burstHearts(30);
    typeWriter($('#title'));
  });

  // ===== Theme toggle =====
  const toggleTheme = $('#toggleTheme');
  const setTheme = (t) => {
    if(t==='night') document.documentElement.setAttribute('data-theme','night');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('love.theme', t||'day');
  }
  setTheme(localStorage.getItem('love.theme'));
  toggleTheme.addEventListener('click', ()=>{
    const now = document.documentElement.getAttribute('data-theme')==='night' ? 'day':'night';
    setTheme(now);
  });

  // ===== Typewriter =====
  function typeWriter(el){
    if(!el || el.dataset.typed) return; // run once
    el.dataset.typed = '1';
    const full = el.textContent.trim();
    el.textContent = '';
    let i=0;
    const timer = setInterval(()=>{
      el.textContent = full.slice(0, i++);
      if(i>full.length){ clearInterval(timer); el.classList.remove('type'); }
    }, 38);
  }

  // ===== Hearts engine =====
  const heartsWrap = $('#hearts');
  function makeHeart(size=22, left=Math.random()*100, hue){
    const h = document.createElement('div');
    h.className = 'heart';
    const color = `hsl(${hue ?? (320+Math.random()*60)}, 85%, ${55+Math.random()*15}%)`;
    h.style.background = color;
    h.style.left = left+ 'vw';
    h.style.width = h.style.height = size + 'px';
    h.style.setProperty('--dur', (6+Math.random()*5)+'s');
    heartsWrap.appendChild(h);
    setTimeout(()=> h.remove(), 9000);
  }
  function burstHearts(n=10){ for(let i=0;i<n;i++) setTimeout(()=>makeHeart(16+Math.random()*26, Math.random()*100), i*40); }

  $('#shower').addEventListener('click', ()=> burstHearts(28));

  const meter = $('#meterRange');
  const meterLabel = $('#meterLabel');
  let streamTimer;
  const adjustStream = ()=>{
    meterLabel.textContent = meter.value+ '%';
    clearInterval(streamTimer);
    const speed = Math.max(220 - (meter.value*2), 10); // increase density with value
    streamTimer = setInterval(()=> makeHeart(16+Math.random()*14, Math.random()*100), speed);
    if(+meter.value===0) clearInterval(streamTimer);
  }
  meter.addEventListener('input', adjustStream);
  adjustStream();

  // ===== Reasons =====
  const reasonsEl = $('#reasons');
  const defaultReasons = [
    'Yuriya the kindest!',
    'Yuriya the first person I think of everyday!',
    'You make my heart pound really really fast!',
    'You are the best person in the world!',
    'I can forever stare at you and I feel at home!',
    'The person I dream of in my future!',
    'The person I want to wake up to',
    'Yuriya make me the happiest I have ever been!',
    'And many many more!'
  ];
  const savedReasons = JSON.parse(localStorage.getItem('love.reasons')||'null') || defaultReasons;
  function renderReasons(){
    reasonsEl.innerHTML = '';
    savedReasons.forEach((text,i)=>{
      const card = document.createElement('div');
      card.className = 'reason';
      card.innerHTML = `<div class="title">#${i+1}</div><div class="hidden">${escapeHtml(text)}</div>`;
      card.addEventListener('click', ()=>{
        card.classList.toggle('open');
        makeHeart(20+Math.random()*20, 10+Math.random()*80, 340);
      });
      reasonsEl.appendChild(card);
    });
  }
  renderReasons();

// ===== Gallery (preload only, in order) =====
const polaroids = document.querySelector('#polaroids');

function addPolaroid(url, caption = 'us ✨') {
  const it = document.createElement('div');
  it.className = 'polaroid';
  it.style.setProperty('--rot', (Math.random()*10-5)+'deg');
  it.innerHTML = `<img src="${url}" alt="our photo"/><span>${caption}</span>`;
  polaroids.appendChild(it); // append -> preserves 1..20 order
}

// List your files here (adjust .jpg/.png where needed)
const initialPhotos = [
  'photos/1.png','photos/2.jpg','photos/3.jpg','photos/4.jpg','photos/5.jpg',
  'photos/6.png','photos/7.jpg','photos/8.jpg','photos/9.jpg','photos/10.jpg',
  'photos/11.jpg','photos/12.jpg','photos/13.jpg','photos/14.jpg','photos/15.jpg',
  'photos/16.png','photos/17.jpg','photos/18.png','photos/19.jpg','photos/20.jpg',
];

// Optional: turn filename into a caption
const toCaption = (p) => p.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

// Preload
initialPhotos.forEach(src => addPolaroid(src, toCaption(src)));



// ===== Quiz =====
const quizMsg = document.querySelector('#quizMsg');
document.querySelectorAll('.answer').forEach(btn => {
  btn.addEventListener('click', () => {
    const replies = [
      'Correct. Every option with you is perfect. 💘',
      'Ding ding! We just unlocked a core memory. ✨',
      'Yes. And I’m buying dessert. 🍨',
      'Approved by the Council of Cuddles. 🫶'
    ];
    if (quizMsg) quizMsg.textContent = replies[Math.floor(Math.random()*replies.length)];
    burstHearts(12);
  });
});

  // ===== Personalise modal =====
  const modalTpl = $('#modalTpl');
  const editBtn = $('#editBtn');
  editBtn.addEventListener('click', ()=>{
    const node = modalTpl.content.cloneNode(true);
    document.body.appendChild(node);
    const dlg = $('#modal');
    const inName = $('#inName');
    const inSubtitle = $('#inSubtitle');
    const inMsg = $('#inMsg');
    const inSign = $('#inSign');
    const inReason = $('#inReason');

    inName.value = localStorage.getItem('love.name') || $('#name').textContent;
    inSubtitle.value = localStorage.getItem('love.subtitle') || $('#subtitle').textContent;
    inMsg.value = localStorage.getItem('love.msg') || $('#message').textContent;
    inSign.value = localStorage.getItem('love.sign') || $('#sign').textContent;

    dlg.showModal();
    $('#saveModal').addEventListener('click', e=>{
      e.preventDefault();
      const name = inName.value.trim() || 'My Love';
      const subtitle = inSubtitle.value.trim();
      const msg = inMsg.value.trim();
      const sign = inSign.value.trim();
      const r = inReason.value.trim();
      $('#name').textContent = name;
      if(subtitle) $('#subtitle').textContent = subtitle;
      if(msg) $('#message').textContent = msg;
      if(sign) $('#sign').textContent = sign;

      localStorage.setItem('love.name', name);
      localStorage.setItem('love.subtitle', $('#subtitle').textContent);
      localStorage.setItem('love.msg', $('#message').textContent);
      localStorage.setItem('love.sign', $('#sign').textContent);

      if(r){ savedReasons.push(r); localStorage.setItem('love.reasons', JSON.stringify(savedReasons)); renderReasons(); }
      dlg.close(); dlg.remove();
    });
    dlg.addEventListener('close', ()=> dlg.remove());
  });

  // ===== Save as file =====
  const saveBtn = $('#saveBtn');
  saveBtn.addEventListener('click', ()=>{
    const blob = new Blob([document.documentElement.outerHTML], {type:'text/html'});
    saveBtn.href = URL.createObjectURL(blob);
  });

  // ===== Apply saved personalisation on load =====
  (function restore(){
    const n = localStorage.getItem('love.name'); if(n) $('#name').textContent = n;
    const s = localStorage.getItem('love.subtitle'); if(s) $('#subtitle').textContent = s;
    const m = localStorage.getItem('love.msg'); if(m) $('#message').textContent = m;
    const sig = localStorage.getItem('love.sign'); if(sig) $('#sign').textContent = sig;
    const rs = JSON.parse(localStorage.getItem('love.reasons')||'null');
    if(rs) { rs.forEach((v,i)=> savedReasons[i]=v); renderReasons(); }
  })();

  // ===== Helpers =====
  function escapeHtml(str){
    return str.replace(/[&<>"]+/g, s=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }
})();
