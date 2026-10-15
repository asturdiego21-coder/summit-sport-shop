/**
 * app.js — Interactividad de la web (JavaScript vainilla, sin dependencias).
 *
 * Módulos (cada uno es una función independiente, fácil de convertir en componente React):
 *   1. Utilidades y estado (carrito y favoritos en localStorage)
 *   2. Menú móvil
 *   3. Marcas
 *   4. Productos: render, filtros y búsqueda
 *   5. Carrito
 *   6. Favoritos
 *   7. Newsletter
 */
(function () {
  'use strict';

  /* ---------- 1. Utilidades y estado ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const euro = (n) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

  // localStorage puede no estar disponible (modo privado): se protege cada acceso.
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin persistencia */ }
    }
  };

  const state = {
    filter: 'todos',   // todos | asfalto | trail | textil | accesorios | favoritos
    query: '',
    cart: store.get('summit-cart', []),   // [{ id, size, qty }]
    wish: store.get('summit-wish', []),   // [id]
    sizes: {}                              // talla elegida por producto: { id: "42" }
  };

  const productById = (id) => window.PRODUCTS.find((p) => p.id === id);

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- 2. Menú móvil y navegación ---------- */
  function initMenu() {
    const btn = $('#menu-btn');
    const menu = $('#mobile-menu');
    const setOpen = (open) => {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));

    // Cualquier enlace con data-filter aplica ese filtro en el catálogo.
    $$('a[data-filter]').forEach((a) =>
      a.addEventListener('click', () => setFilter(a.dataset.filter))
    );
  }

  /* ---------- 3. Marcas ---------- */
  // OJO: lista orientativa de marcas habituales; confirmar cuáles vende realmente la tienda.
  const BRANDS = ['Salomon', 'Hoka', 'Brooks', 'Asics', 'La Sportiva', 'Altra', 'Saucony', 'Mizuno',
    'Nike', 'Adidas', 'New Balance', 'Compressport', 'Garmin', 'Coros', 'Petzl', 'Buff',
    'The North Face', 'Columbia', 'Speedo', 'Arena'];

  function renderBrands() {
    $('#brand-grid').innerHTML = BRANDS.map((b) => `<li class="brand-item">${b}</li>`).join('');
  }

  /* ---------- 4. Productos ---------- */
  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    return window.PRODUCTS.filter((p) => {
      const byFilter =
        state.filter === 'todos' ? true :
        state.filter === 'favoritos' ? state.wish.includes(p.id) :
        p.cat === state.filter;
      const byQuery = !q || (p.name + ' ' + p.desc + ' ' + p.cat).toLowerCase().includes(q);
      return byFilter && byQuery;
    });
  }

  function productCard(p) {
    const size = state.sizes[p.id] || p.sizes[0];
    const media = p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
      : `<svg viewBox="0 0 120 80" aria-hidden="true">${window.ICONS[p.icon]}</svg>`;
    const sizes = p.sizes.map((s) =>
      `<button class="size-btn ${s === size ? 'is-on' : ''}" data-size="${s}" aria-pressed="${s === size}">${s}</button>`
    ).join('');
    const on = state.wish.includes(p.id);
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-img">
          ${p.badge ? `<span class="tag">${p.badge}</span>` : ''}
          <button class="wish ${on ? 'is-on' : ''}" aria-label="${on ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${on}">
            <svg class="w-5 h-5" style="width:20px;height:20px" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z" stroke-linejoin="round"/></svg>
          </button>
          ${media}
        </div>
        <div class="pt-4 flex-1 flex flex-col">
          <span class="text-[11px] tracking-[.2em] uppercase text-neutral-500">${labelCat(p.cat)}</span>
          <h3 class="font-display text-xl sm:text-2xl uppercase leading-none mt-1">${p.name}</h3>
          <p class="text-sm text-neutral-500 mt-2 hidden sm:block">${p.desc}</p>
          <p class="font-semibold mt-3">${euro(p.price)}</p>
          <div class="flex flex-wrap gap-1.5 mt-3" role="group" aria-label="Tallas disponibles">${sizes}</div>
          <button class="add-btn" data-add>Añadir al carrito</button>
        </div>
      </article>`;
  }

  function labelCat(cat) {
    return { asfalto: 'Running', trail: 'Trail', textil: 'Textil', accesorios: 'Accesorios' }[cat] || cat;
  }

  function renderProducts() {
    const list = visibleProducts();
    $('#product-grid').innerHTML = list.map(productCard).join('');
    $('#no-results').classList.toggle('hidden', list.length > 0);
    $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === state.filter));
  }

  function setFilter(filter) {
    state.filter = filter;
    state.query = '';
    $('#search-input').value = '';
    renderProducts();
  }

  function initProducts() {
    renderProducts();

    $('#filters').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) setFilter(chip.dataset.filter);
    });

    // Delegación de eventos sobre la cuadrícula: tallas, favoritos y añadir al carrito.
    $('#product-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = Number(card.dataset.id);

      const sizeBtn = e.target.closest('.size-btn');
      if (sizeBtn) {
        state.sizes[id] = sizeBtn.dataset.size;
        $$('.size-btn', card).forEach((b) => {
          const on = b === sizeBtn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        return;
      }
      if (e.target.closest('.wish')) { toggleWish(id); return; }
      if (e.target.closest('[data-add]')) { addToCart(id, state.sizes[id] || productById(id).sizes[0]); }
    });

    // Buscador
    const panel = $('#search-panel');
    const input = $('#search-input');
    $('#search-btn').addEventListener('click', () => { panel.classList.remove('hidden'); input.focus(); });
    $('#search-close').addEventListener('click', () => panel.classList.add('hidden'));
    input.addEventListener('input', () => {
      state.query = input.value;
      state.filter = 'todos';
      renderProducts();
      if (state.query) $('#productos').scrollIntoView({ behavior: 'smooth' });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { panel.classList.add('hidden'); closeCart(); }
    });
  }

  /* ---------- 5. Carrito ---------- */
  function addToCart(id, size) {
    const line = state.cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty += 1; else state.cart.push({ id, size, qty: 1 });
    saveCart();
    toast(`${productById(id).name} (${size}) añadido`);
  }

  function changeQty(id, size, delta) {
    const line = state.cart.find((l) => l.id === id && l.size === size);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l !== line);
    saveCart();
  }

  function saveCart() {
    store.set('summit-cart', state.cart);
    renderCart();
  }

  function renderCart() {
    const count = state.cart.reduce((n, l) => n + l.qty, 0);
    const total = state.cart.reduce((n, l) => n + l.qty * productById(l.id).price, 0);
    const badge = $('#cart-count');
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
    $('#cart-total').textContent = euro(total);

    $('#cart-items').innerHTML = state.cart.length
      ? state.cart.map((l) => {
          const p = productById(l.id);
          return `
            <li class="cart-row">
              <div class="thumb"><svg viewBox="0 0 120 80" aria-hidden="true">${window.ICONS[p.icon]}</svg></div>
              <div>
                <p class="font-semibold text-sm leading-tight">${p.name}</p>
                <p class="text-xs text-neutral-500 mt-1">Talla ${l.size} · ${euro(p.price)}</p>
                <div class="qty flex items-center gap-2 mt-2 text-sm">
                  <button data-qty="-1" data-id="${l.id}" data-size="${l.size}" aria-label="Quitar uno">−</button>
                  <span>${l.qty}</span>
                  <button data-qty="1" data-id="${l.id}" data-size="${l.size}" aria-label="Añadir uno">+</button>
                </div>
              </div>
              <p class="font-semibold text-sm">${euro(p.price * l.qty)}</p>
            </li>`;
        }).join('')
      : '<li class="p-8 text-center text-neutral-500 text-sm">Tu selección está vacía.</li>';
  }

  function openCart() {
    $('#cart-panel').classList.remove('translate-x-full');
    $('#cart-panel').setAttribute('aria-hidden', 'false');
    $('#overlay').classList.remove('hidden');
  }
  function closeCart() {
    $('#cart-panel').classList.add('translate-x-full');
    $('#cart-panel').setAttribute('aria-hidden', 'true');
    $('#overlay').classList.add('hidden');
  }

  function initCart() {
    renderCart();
    $('#cart-btn').addEventListener('click', openCart);
    $('#cart-close').addEventListener('click', closeCart);
    $('#overlay').addEventListener('click', closeCart);
    $('#cart-items').addEventListener('click', (e) => {
      const b = e.target.closest('[data-qty]');
      if (b) changeQty(Number(b.dataset.id), b.dataset.size, Number(b.dataset.qty));
    });
  }

  /* ---------- 6. Favoritos ---------- */
  function toggleWish(id) {
    state.wish = state.wish.includes(id) ? state.wish.filter((w) => w !== id) : [...state.wish, id];
    store.set('summit-wish', state.wish);
    updateWishCount();
    renderProducts();
  }

  function updateWishCount() {
    const badge = $('#wish-count');
    badge.textContent = state.wish.length;
    badge.classList.toggle('hidden', state.wish.length === 0);
  }

  function initWish() {
    updateWishCount();
    $('#wish-btn').addEventListener('click', () => {
      if (!state.wish.length) { toast('Aún no tienes favoritos. Pulsa el corazón en un producto.'); return; }
      setFilter('favoritos');
      $('#productos').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- 7. Newsletter ---------- */
  function initNewsletter() {
    const form = $('#newsletter');
    const msg = $('#nl-msg');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#nl-email').value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      msg.classList.remove('hidden');
      // Aún sin backend: el correo NO se guarda. Conectar a un servicio (Mailchimp, Brevo…) cuando se decida.
      msg.textContent = ok
        ? '¡Gracias! (Demostración: el formulario todavía no está conectado a ninguna lista.)'
        : 'Introduce un correo electrónico válido.';
      if (ok) form.reset();
    });
  }

  /* ---------- Arranque ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    renderBrands();
    initProducts();
    initCart();
    initWish();
    initNewsletter();
  });
})();


/* ---------- Animaciones al hacer scroll ----------
   Marca los bloques principales de cada sección y los revela al entrar en pantalla. */
(function initReveal() {
  const targets = document.querySelectorAll('main section > div, body > section > div, footer > div');
  if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
})();
