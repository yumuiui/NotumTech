/* ================================================================
   NOTUM TECNOLOGIA — App.js
   Custom Cursor · Canvas Hero · Bento Grid · 3D Tilt
   Magnetic Buttons · Search · Auth · CRUD · WhatsApp
   ================================================================ */
'use strict';

// ── Config ────────────────────────────────────
const ADMIN_EMAIL = 'admin@notum.com.br';
const SK = { products:'notum_v2_products', settings:'notum_v2_settings', session:'notum_v2_session', pw:'notum_v2_pw' };

const CAT_ICON = { smartphones:'📱', notebooks:'💻', tablets:'📟', smartwatches:'⌚', acessorios:'🎧', games:'🎮' };
const CAT_LABEL = { smartphones:'Smartphone', notebooks:'Notebook', tablets:'Tablet', smartwatches:'Smartwatch', acessorios:'Acessório', games:'Games' };
const COND_LABEL = { novo:'Novo', seminovo:'Seminovo', usado:'Usado' };

const DEFAULTS = {
  waMessage:'Olá! Vi o catálogo da Notum e tenho interesse: *{produto}*. Pode me ajudar?',
  whatsapp:'',
};

const SEED = [
  { id:'p1', name:'iPhone 15 Pro Max', category:'smartphones', price:'R$ 7.999', condition:'novo', description:'Titânio natural · A17 Pro · câmera 48MP · iOS 17', image:'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', badge:'Destaque', size:'wide' },
  { id:'p2', name:'MacBook Air M3', category:'notebooks', price:'R$ 9.499', condition:'novo', description:'Chip M3 · 8GB RAM · 256GB SSD · até 18h bateria', image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', badge:'Novo', size:'normal' },
  { id:'p3', name:'Samsung Galaxy S24 Ultra', category:'smartphones', price:'R$ 6.299', condition:'novo', description:'Snapdragon 8 Gen 3 · S Pen · câmera 200MP · 12GB RAM', image:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', badge:'', size:'normal' },
  { id:'p4', name:'iPad Air 11" M2', category:'tablets', price:'R$ 5.299', condition:'novo', description:'Chip M2 · Liquid Retina · Apple Pencil Pro · Wi-Fi + 5G', image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', badge:'', size:'tall' },
  { id:'p5', name:'AirPods Pro 2ª Geração', category:'acessorios', price:'R$ 1.999', condition:'novo', description:'ANC adaptativo · USB-C · até 30h com o case', image:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80', badge:'', size:'normal' },
  { id:'p6', name:'PlayStation 5 Slim', category:'games', price:'R$ 4.199', condition:'novo', description:'SSD ultrarrápido · 4K 120fps · ray-tracing · DualSense', image:'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80', badge:'Oferta', size:'normal' },
  { id:'p7', name:'Apple Watch Series 9', category:'smartwatches', price:'R$ 2.799', condition:'novo', description:'Chip S9 · Always-On · GPS · saúde avançada', image:'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80', badge:'', size:'normal' },
  { id:'p8', name:'Dell XPS 13 Plus', category:'notebooks', price:'R$ 8.799', condition:'seminovo', description:'Core i7 13ª gen · 16GB · 512GB SSD NVMe · OLED', image:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', badge:'Seminovo', size:'normal' },
  { id:'p9', name:'Xiaomi Redmi Note 13 Pro', category:'smartphones', price:'R$ 1.899', condition:'novo', description:'200MP · 67W carga rápida · AMOLED 120Hz · 256GB', image:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80', badge:'', size:'normal' },
  { id:'p10', name:'Nintendo Switch OLED', category:'games', price:'R$ 2.599', condition:'novo', description:'Tela OLED 7" · 64GB · base com LAN · Joy-Con', image:'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80', badge:'', size:'normal' },
  { id:'p11', name:'Galaxy Watch 6 Classic', category:'smartwatches', price:'R$ 1.799', condition:'novo', description:'Moldura giratória · GPS · 4G · monitor de saúde', image:'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', badge:'', size:'normal' },
  { id:'p12', name:'JBL Charge 5 Wi-Fi', category:'acessorios', price:'R$ 1.299', condition:'novo', description:'IP67 · 20h bateria · Wi-Fi + Bluetooth · bass potente', image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', badge:'', size:'normal' },
];

// ── State ──────────────────────────────────────
let S = {
  products: [],
  settings: { ...DEFAULTS },
  isAdmin: false,
  cat: 'todos',
  query: '',
};

// ── Storage ────────────────────────────────────
const ls = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k),
};
const pw = () => localStorage.getItem(SK.pw) || 'Notum@2025';
const setPw = (v) => localStorage.setItem(SK.pw, v);

// ── WhatsApp ────────────────────────────────────
function waURL(name) {
  const num = S.settings.whatsapp.replace(/\D/g, '');
  if (!num) return null;
  const msg = (S.settings.waMessage || DEFAULTS.waMessage).replace('{produto}', name);
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
function goWa(name) {
  const url = waURL(name);
  if (!url) { toast('⚠️ Configure o WhatsApp no painel admin.'); return; }
  window.open(url, '_blank', 'noopener');
}
function syncWaLinks() {
  const num = S.settings.whatsapp.replace(/\D/g, '');
  const href = num ? `https://wa.me/${num}` : '#';
  document.getElementById('heroWa').href = href;
  document.getElementById('ctaWa').href = href;
}

// ── Products ────────────────────────────────────
const uid = () => 'p' + Date.now() + Math.random().toString(36).slice(2,5);
const filtered = () => S.products.filter(p => {
  const mc = S.cat === 'todos' || p.category === S.cat;
  const q = S.query.toLowerCase();
  const ms = !q || p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (CAT_LABEL[p.category]||'').toLowerCase().includes(q);
  return mc && ms;
});

// ── Render Bento Grid ───────────────────────────
function badgeMod(b) {
  if (!b) return '';
  const l = b.toLowerCase();
  if (l.includes('oferta') || l.includes('promo')) return 'ba-amber';
  if (l.includes('novo')) return 'ba-green';
  if (l.includes('último') || l.includes('ultimo') || l.includes('esgot')) return 'ba-red';
  return '';
}

function cardHTML(p) {
  const icon = CAT_ICON[p.category] || '📦';
  const sizeClass = p.size === 'wide' ? 'wide' : p.size === 'tall' ? 'tall' : '';
  const imgHTML = p.image
    ? `<img src="${escHTML(p.image)}" alt="${escHTML(p.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'b-card-placeholder\\'>${icon}</div>'">`
    : `<div class="b-card-placeholder">${icon}</div>`;
  const badgeHTML = p.badge ? `<div class="b-card-badge ${badgeMod(p.badge)}">${escHTML(p.badge)}</div>` : '';
  const adminHTML = S.isAdmin ? `
    <div class="b-card-admin">
      <button class="b-btn-edit" onclick="editProduct('${p.id}');event.stopPropagation()">✏ Editar</button>
      <button class="b-btn-del" onclick="delProduct('${p.id}');event.stopPropagation()">✕ Excluir</button>
    </div>` : '';

  return `
    <div class="b-card ${sizeClass} reveal-up" data-id="${p.id}" onclick="openDetail('${p.id}')">
      <div class="b-card-img">${imgHTML}${badgeHTML}</div>
      <div class="b-card-body">
        <div class="b-card-meta">
          <span class="b-card-cat">${CAT_LABEL[p.category] || p.category}</span>
          <span class="b-card-cond">${COND_LABEL[p.condition] || p.condition}</span>
        </div>
        <h3 class="b-card-name">${escHTML(p.name)}</h3>
        ${p.description ? `<p class="b-card-desc">${escHTML(p.description)}</p>` : ''}
        <div class="b-card-footer">
          <div>
            <div class="b-card-price">${p.price || 'Consultar'}</div>
            <div class="b-card-price-note">via WhatsApp</div>
          </div>
          <button class="btn-wa-card" onclick="goWa('${escAttr(p.name)}');event.stopPropagation()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Quero
          </button>
        </div>
      </div>
      ${adminHTML}
    </div>`;
}

function render() {
  const grid = document.getElementById('bentoGrid');
  const empty = document.getElementById('emptyState');
  const list = filtered();
  if (!list.length) {
    grid.innerHTML = '';
    empty.classList.add('visible');
  } else {
    empty.classList.remove('visible');
    grid.innerHTML = list.map(cardHTML).join('');
    observeReveal();
    initTilt();
  }
}

// ── Detail Panel ────────────────────────────────
function openDetail(id) {
  const p = S.products.find(x => x.id === id);
  if (!p) return;
  const icon = CAT_ICON[p.category] || '📦';
  const imgHTML = p.image
    ? `<img src="${escHTML(p.image)}" alt="${escHTML(p.name)}" onerror="this.parentElement.innerHTML='<div class=\\'dp-img-ph\\'>${icon}</div>'">`
    : `<div class="dp-img-ph">${icon}</div>`;
  document.getElementById('detailBody').innerHTML = `
    <div class="dp-img">${imgHTML}</div>
    <div class="dp-cat">${CAT_LABEL[p.category] || p.category}</div>
    <h2 class="dp-name">${escHTML(p.name)}</h2>
    <div class="dp-price">${p.price || 'Consultar'}</div>
    <span class="dp-cond">${COND_LABEL[p.condition] || p.condition}</span>
    ${p.description ? `<p class="dp-desc">${escHTML(p.description)}</p>` : ''}
    <button class="btn-wa-big dp-wa-btn" onclick="goWa('${escAttr(p.name)}')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Tenho interesse — Falar no WhatsApp
    </button>`;
  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
document.getElementById('detailOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeDetail();
});
document.getElementById('detailClose').addEventListener('click', closeDetail);
function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Auth ────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('lEmail').value.trim();
  const pass = document.getElementById('lPass').value;
  const err = document.getElementById('lError');
  if (email !== ADMIN_EMAIL || pass !== pw()) {
    err.textContent = 'Credenciais incorretas.';
    err.classList.add('visible');
    return;
  }
  err.classList.remove('visible');
  S.isAdmin = true;
  ls.set(SK.session, 1);
  closeModal('loginModal');
  updateAdminUI();
  render();
  toast('✅ Bem-vindo, admin!');
}

function handleLogout() {
  S.isAdmin = false;
  ls.del(SK.session);
  updateAdminUI();
  render();
  toast('Sessão encerrada.');
}

function updateAdminUI() {
  const tb = document.getElementById('adminToolbar');
  const ab = document.getElementById('authBtn');
  const dab = document.getElementById('drawerAuthBtn');
  if (S.isAdmin) {
    tb.classList.add('visible');
    ab.textContent = 'Sair';
    ab.onclick = handleLogout;
    dab.textContent = 'Sair';
    dab.onclick = handleLogout;
  } else {
    tb.classList.remove('visible');
    ab.textContent = 'Entrar';
    ab.onclick = openLogin;
    dab.textContent = 'Entrar';
    dab.onclick = () => { openLogin(); closeDrawer(); };
  }
}

function openLogin() {
  document.getElementById('loginForm').reset();
  document.getElementById('lError').classList.remove('visible');
  openModal('loginModal');
}

// ── Product CRUD ────────────────────────────────
function openProductModal(id) {
  document.getElementById('productForm').reset();
  document.getElementById('pId').value = '';
  document.getElementById('pmTitle').textContent = 'Novo Produto';
  if (id) {
    const p = S.products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('pmTitle').textContent = 'Editar Produto';
    document.getElementById('pId').value = p.id;
    document.getElementById('pName').value = p.name;
    document.getElementById('pCat').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pCond').value = p.condition;
    document.getElementById('pDesc').value = p.description || '';
    document.getElementById('pImg').value = p.image || '';
    document.getElementById('pBadge').value = p.badge || '';
    document.getElementById('pSize').value = p.size || 'normal';
  }
  openModal('productModal');
}

function handleSaveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('pId').value;
  const prod = {
    id: id || uid(),
    name: document.getElementById('pName').value.trim(),
    category: document.getElementById('pCat').value,
    price: document.getElementById('pPrice').value.trim(),
    condition: document.getElementById('pCond').value,
    description: document.getElementById('pDesc').value.trim(),
    image: document.getElementById('pImg').value.trim(),
    badge: document.getElementById('pBadge').value.trim(),
    size: document.getElementById('pSize').value,
  };
  if (id) {
    const i = S.products.findIndex(x => x.id === id);
    if (i !== -1) S.products[i] = prod;
    toast('✅ Produto atualizado!');
  } else {
    S.products.unshift(prod);
    toast('✅ Produto adicionado!');
  }
  ls.set(SK.products, S.products);
  render();
  closeModal('productModal');
}

function editProduct(id) { if (S.isAdmin) openProductModal(id); }

function delProduct(id) {
  if (!S.isAdmin) return;
  const p = S.products.find(x => x.id === id);
  if (!p || !confirm(`Excluir "${p.name}"?`)) return;
  S.products = S.products.filter(x => x.id !== id);
  ls.set(SK.products, S.products);
  render();
  toast('🗑️ Produto excluído.');
}

// ── Settings ────────────────────────────────────
function openSettings() {
  document.getElementById('sWa').value = S.settings.whatsapp || '';
  document.getElementById('sMsg').value = S.settings.waMessage || DEFAULTS.waMessage;
  document.getElementById('sNewPw').value = '';
  document.getElementById('sConfPw').value = '';
  document.getElementById('sError').classList.remove('visible');
  openModal('settingsModal');
}

function handleSaveSettings(e) {
  e.preventDefault();
  const np = document.getElementById('sNewPw').value;
  const cp = document.getElementById('sConfPw').value;
  const err = document.getElementById('sError');
  if (np && np !== cp) { err.textContent = 'Senhas não coincidem.'; err.classList.add('visible'); return; }
  if (np && np.length < 6) { err.textContent = 'Mínimo 6 caracteres.'; err.classList.add('visible'); return; }
  err.classList.remove('visible');
  S.settings.whatsapp = document.getElementById('sWa').value.replace(/\D/g, '');
  S.settings.waMessage = document.getElementById('sMsg').value.trim() || DEFAULTS.waMessage;
  if (np) setPw(np);
  ls.set(SK.settings, S.settings);
  syncWaLinks();
  closeModal('settingsModal');
  toast('✅ Configurações salvas!');
}

// ── Modal Helpers ───────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
['loginModal','productModal','settingsModal'].forEach(id => {
  document.getElementById(id).addEventListener('click', e => { if (e.target.id === id) closeModal(id); });
});

// ── Drawer ──────────────────────────────────────
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Search ──────────────────────────────────────
function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  document.getElementById('searchInput').focus();
  document.body.style.overflow = 'hidden';
}
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.body.style.overflow = '';
}
function renderSearchResults(q) {
  const el = document.getElementById('searchResults');
  if (!q.trim()) { el.innerHTML = ''; return; }
  const res = S.products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    (p.description||'').toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);
  if (!res.length) { el.innerHTML = '<div class="sr-empty">Nenhum resultado</div>'; return; }
  el.innerHTML = res.map(p => {
    const icon = CAT_ICON[p.category] || '📦';
    const thumb = p.image
      ? `<img src="${escHTML(p.image)}" alt="" onerror="this.parentElement.innerHTML='${icon}'">`
      : icon;
    return `<div class="sr-item" onclick="closeSearch();openDetail('${p.id}')">
      <div class="sr-thumb">${thumb}</div>
      <div><div class="sr-name">${escHTML(p.name)}</div><div class="sr-price">${p.price || 'Consultar'}</div></div>
    </div>`;
  }).join('');
}

// ── Category Filter ─────────────────────────────
function setCategory(cat) {
  S.cat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === cat));
  render();
}

// ── Toast ───────────────────────────────────────
let _tt;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Escape helpers ──────────────────────────────
function escHTML(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return String(s).replace(/'/g,"&#39;"); }

// ── 3D Card Tilt ────────────────────────────────
function initTilt() {
  document.querySelectorAll('.b-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
      card.style.transition = 'transform .4s cubic-bezier(.25,.46,.45,.94), border-color .3s, box-shadow .3s';
      setTimeout(() => card.style.transition = '', 400);
    });
  });
}

// ── Magnetic Buttons ────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}


// ── Hero Canvas (Dot Grid + Gradient) ───────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, mouse = { x: -1000, y: -1000 };
  const DOT_SPACING = 36;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  // Animated gradient blobs
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    // Gradient blobs
    const blobs = [
      { x: W * (.3 + .15 * Math.sin(t)), y: H * (.35 + .1 * Math.cos(t * .7)), r: W * .35, c1: 'rgba(99,102,241,.18)', c2: 'transparent' },
      { x: W * (.7 + .1 * Math.cos(t * .8)), y: H * (.55 + .12 * Math.sin(t * .6)), r: W * .28, c1: 'rgba(34,211,238,.10)', c2: 'transparent' },
      { x: W * (.5 + .08 * Math.sin(t * 1.2)), y: H * (.2 + .08 * Math.cos(t)), r: W * .22, c1: 'rgba(167,139,250,.08)', c2: 'transparent' },
    ];
    blobs.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c1); g.addColorStop(1, b.c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });

    // Dot grid
    const cols = Math.ceil(W / DOT_SPACING) + 1;
    const rows = Math.ceil(H / DOT_SPACING) + 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * DOT_SPACING;
        const y = row * DOT_SPACING;
        const dist = Math.hypot(x - mouse.x, y - mouse.y);
        const maxD = 120;
        const proximity = Math.max(0, 1 - dist / maxD);
        const r = 1 + proximity * 2.5;
        const alpha = 0.08 + proximity * 0.5;
        const hue = proximity > 0.1 ? `rgba(99,102,241,${alpha})` : `rgba(255,255,255,${alpha * .5})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = hue;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// ── Scroll Animations (IntersectionObserver) ────
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) { el.target.classList.add('visible'); io.unobserve(el.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => io.observe(el));
}

// ── Counter Animation ───────────────────────────
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '+';
      const dur = 1200;
      const start = performance.now();
      function step(now) {
        const prog = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

// ── Nav scroll ──────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('floatNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Keyboard shortcuts ──────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearch(); closeDetail();
    ['loginModal','productModal','settingsModal'].forEach(id => closeModal(id));
    closeDrawer();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

// ── ⌘K hint on search button ───────────────────
document.getElementById('searchBtn').title = 'Buscar (Ctrl+K)';

// ── Drawer links close on click ─────────────────
document.querySelectorAll('.drawer-link').forEach(a => a.addEventListener('click', closeDrawer));

// ── Init ─────────────────────────────────────────
function init() {
  const saved = ls.get(SK.products, null);
  S.products = (saved && saved.length) ? saved : [...SEED];
  if (!saved || !saved.length) ls.set(SK.products, S.products);
  S.settings = ls.get(SK.settings, { ...DEFAULTS });
  if (ls.get(SK.session, null)) S.isAdmin = true;

  render();
  updateAdminUI();
  syncWaLinks();
  initHeroCanvas();
  initMagnetic();
  initCounters();
  initNavScroll();
  observeReveal();

  // ── Event bindings ──
  document.getElementById('authBtn').onclick = S.isAdmin ? handleLogout : openLogin;
  document.getElementById('menuBtn').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);

  document.getElementById('searchBtn').addEventListener('click', openSearch);
  document.getElementById('searchOverlay').addEventListener('click', e => { if (e.target.id === 'searchOverlay') closeSearch(); });
  document.getElementById('searchInput').addEventListener('input', e => renderSearchResults(e.target.value));

  document.getElementById('catPills').addEventListener('click', e => {
    const pill = e.target.closest('.cat-pill');
    if (pill) setCategory(pill.dataset.cat);
  });

  // Footer filter links
  document.querySelectorAll('[data-filter]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    setCategory(a.dataset.filter);
    document.getElementById('produtos').scrollIntoView({ behavior:'smooth' });
  }));

  // WhatsApp hero/cta
  document.getElementById('heroWa').addEventListener('click', e => {
    if (!S.settings.whatsapp) { e.preventDefault(); toast('⚠️ Configure o WhatsApp nas Configurações.'); }
  });
  document.getElementById('ctaWa').addEventListener('click', e => {
    if (!S.settings.whatsapp) { e.preventDefault(); toast('⚠️ Configure o WhatsApp nas Configurações.'); }
  });

  // Hint for admin
  if (S.isAdmin && !S.settings.whatsapp) {
    setTimeout(() => toast('⚙️ Configure o número do WhatsApp!'), 1500);
  }
}

document.addEventListener('DOMContentLoaded', init);
