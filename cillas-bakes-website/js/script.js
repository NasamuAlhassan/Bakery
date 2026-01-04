/* js/script.js
   - Sample product data
   - Rendering for featured/products/gallery
   - Cart logic using localStorage
   - Checkout, contact form handling
   - Theme toggle
*/

const PRODUCTS = [
  { id: 'p1', title: 'Classic Chocolate Cake', price: 100.00, category: 'cakes', image: 'cake.jfif', description: 'Rich chocolate sponge with ganache frosting.' },
  { id: 'p2', title: 'Vanilla Cupcakes (6)', price: 50.00, category: 'cakes', image: 'cupcake.jfif', description: 'Light vanilla cupcakes topped with buttercream.' },
  { id: 'p3', title: 'Money Bouquet', price: 100.00, category: 'bouquet', image: 'bouquet.jfif', description: 'A unique gift combining cash and flowers' },
  { id: 'p4', title: 'Assorted Cookies Box', price: 55.00, category: 'gifts', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop', description: 'A box of assorted cookies — perfect for gifting.' },
  { id: 'p5', title: 'Strawberry Tart', price: 65.00, category: 'desserts', image: 'strawberry.jfif', description: 'Buttery tart shell with fresh strawberries.' },
  { id: 'p6', title: 'Custom Celebration Cake', price: 250.00, category: 'cakes', image: 'cel cake.jfif', description: 'Order a custom design for your special day.' },
  { id: 'p7', title: 'Savory Meat Pie', price: 20.00, category: 'savory', image: 'meatpie.jfif', description: 'Flaky pastry with seasoned minced meat.' },
  { id: 'p8', title: 'Stone-baked Pizza Slice', price: 35.00, category: 'savory', image: 'pizza slice.jfif', description: 'Classic margherita slice with fresh basil.' },
  { id: 'p9', title: 'Glazed Doughnut', price: 8.00, category: 'desserts', image: 'donutss.jfif', description: 'Soft fried doughnut with sweet glaze.' },
  { id: 'p10', title: 'Berry Parfait', price: 18.00, category: 'desserts', image: 'parfait.jfif', description: 'Layers of yogurt, granola and fresh berries.' },
  { id: 'p11', title: 'Spring Rolls', price: 22.00, category: 'savory', image: 'springrolls.jfif', description: 'Crispy vegetarian spring rolls with dip.' },
  { id: 'p12', title: 'Snack Box (Assorted)', price: 40.00, category: 'snacks', image: 'codej.jpg', description: 'A curated mix of small bites and savories.' }
];

const CART_KEY = 'cillas_cart_v1';
function loadCart(){ try{ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : {}; }catch(e){ console.error('Failed to load cart', e); return {}; } }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function addToCart(productId, qty = 1){ const cart = loadCart(); if(cart[productId]) cart[productId] += qty; else cart[productId] = qty; saveCart(cart); animateCartAdd(); }
function removeFromCart(productId){ const cart = loadCart(); delete cart[productId]; saveCart(cart); renderCartPage(); }
function updateQuantity(productId, qty){ const cart = loadCart(); if(qty <= 0){ delete cart[productId]; } else { cart[productId] = qty; } saveCart(cart); renderCartPage(); }
function clearCart(){ localStorage.removeItem(CART_KEY); updateCartCount(); }

/* Rendering helpers */
function formatPrice(n){ return `GHS ${n.toFixed(2)}`; }

function renderFeatured(){ const container = document.getElementById('featuredProducts'); if(!container) return; const featured = PRODUCTS.slice(0,3); container.innerHTML = featured.map(p => `
  <article class="product-card">
    <img src="${p.image}" alt="${p.title}">
    <h4>${p.title}</h4>
    <p class="muted">${p.description}</p>
    <div class="price-row">
      <strong>${formatPrice(p.price)}</strong>
      <button class="btn primary" data-add="${p.id}">Add</button>
    </div>
  </article>
`).join(''); }

function renderProducts(){ const list = document.getElementById('productList'); if(!list) return; list.innerHTML = PRODUCTS.map(p => `
  <article class="product-card">
    <img src="${p.image}" alt="${p.title}">
    <h4>${p.title}</h4>
    <p>${p.description}</p>
    <div class="price-row">
      <strong>${formatPrice(p.price)}</strong>
      <div>
        <button class="btn ghost" onclick="location.href='${p.id === 'p6' ? 'contact.html' : 'shop.html'}'">Details</button>
        <button class="btn primary" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </article>
`).join(''); }

function renderGallery(){ const grid = document.getElementById('galleryGrid'); if(!grid) return; grid.innerHTML = PRODUCTS.map(p => `
  <div class="gallery-item glass" data-cat="${p.category}">
    <img src="${p.image}" alt="${p.title}">
    <h4>${p.title}</h4>
  </div>
`).join(''); document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const cat = btn.dataset.cat; document.querySelectorAll('.gallery-item').forEach(item => { if(cat==='all'||item.dataset.cat===cat) item.style.display=''; else item.style.display='none'; }); })); }

/* Cart page */
function renderCartPage(){ const container = document.getElementById('cartItems'); if(!container) return; const cart = loadCart(); const ids = Object.keys(cart); if(ids.length===0){ container.innerHTML = `<div class="center"><p>Your cart is empty.</p><a href="shop.html" class="btn primary">Shop Now</a></div>`; document.getElementById('subtotal').textContent = formatPrice(0); document.getElementById('total').textContent = formatPrice(0); return; } let subtotal = 0; container.innerHTML = ids.map(id => { const product = PRODUCTS.find(p=>p.id===id); const qty = cart[id]; const line = product.price * qty; subtotal += line; return `
  <div class="cart-item">
    <img src="${product.image}" alt="${product.title}">
    <div style="flex:1">
      <h4>${product.title}</h4>
      <p class="muted">${formatPrice(product.price)} x ${qty} = ${formatPrice(line)}</p>
      <div class="qty-controls">
        <button class="btn ghost" data-decrease="${id}">-</button>
        <input type="number" min="0" value="${qty}" data-qty="${id}">
        <button class="btn ghost" data-increase="${id}">+</button>
        <button class="btn" data-remove="${id}">Remove</button>
      </div>
    </div>
  </div>
`; }).join(''); const delivery = 10.00; document.getElementById('subtotal').textContent = formatPrice(subtotal); document.getElementById('delivery').textContent = formatPrice(delivery); document.getElementById('total').textContent = formatPrice(subtotal + delivery);
  document.querySelectorAll('[data-increase]').forEach(b=>b.addEventListener('click',()=>{ const id=b.dataset.increase; const cart=loadCart(); updateQuantity(id, cart[id]+1); }));
  document.querySelectorAll('[data-decrease]').forEach(b=>b.addEventListener('click',()=>{ const id=b.dataset.decrease; const cart=loadCart(); updateQuantity(id, Math.max(0,(cart[id]-1))); }));
  document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{ removeFromCart(b.dataset.remove); }));
  document.querySelectorAll('input[data-qty]').forEach(inp=>inp.addEventListener('change',()=>{ const id=inp.dataset.qty; const val = parseInt(inp.value,10) || 0; updateQuantity(id,val); }));
}

/* Checkout */
function renderCheckout(){ const container = document.getElementById('checkoutItems'); if(!container) return; const cart = loadCart(); const ids = Object.keys(cart); if(ids.length===0){ container.innerHTML = `<p>Your cart is empty. <a href="shop.html">Shop now</a></p>`; document.getElementById('checkoutTotal').textContent = formatPrice(0); return; } let subtotal=0; container.innerHTML = ids.map(id => { const p = PRODUCTS.find(x=>x.id===id); const qty = cart[id]; subtotal += p.price * qty; return `<div class="checkout-line"><strong>${p.title}</strong> <span>${qty} x ${formatPrice(p.price)}</span></div>`; }).join(''); const delivery=10.00; document.getElementById('checkoutTotal').textContent = formatPrice(subtotal + delivery);
  const form = document.getElementById('checkoutForm'); if(form){ form.addEventListener('submit',(e)=>{ e.preventDefault(); if(!form.checkValidity()){ form.reportValidity(); return; } const orderId = 'CBG' + Date.now().toString().slice(-6); localStorage.setItem('lastOrderId', orderId); clearCart(); window.location.href = 'order-confirmation.html'; }); }
}

function renderOrderConfirmation(){ const id = localStorage.getItem('lastOrderId') || ('CBG' + Math.floor(Math.random()*900000+100000)); const el = document.getElementById('orderId'); if(el) el.textContent = id; }

/* Contact */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    // Mock submit: show inline status and reset form
    showContactStatus('Thanks — your message was sent. We will reply shortly.', true);
    form.reset();
  });
}

/* Show contact status in the new #contactStatus element with small animation */
function showContactStatus(message, success = true){
  const el = document.getElementById('contactStatus');
  if(!el) return;
  el.textContent = message;
  el.style.display = 'block';
  el.style.opacity = '0';
  el.style.transition = 'opacity 320ms ease, transform 320ms ease';
  el.style.transform = 'translateY(6px)';
  requestAnimationFrame(()=>{ el.style.opacity = '1'; el.style.transform = 'translateY(0)'; el.style.color = success ? '' : '#b01c1c'; });
  setTimeout(()=>{ el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; setTimeout(()=> el.style.display = 'none', 320); }, 4000);
}

/* Generic inline status helper for small forms (newsletter, etc.) */
function showInlineStatus(id, message, success = true){
  const el = document.getElementById(id);
  if(!el) return;
  el.textContent = message;
  el.style.display = 'block';
  el.style.opacity = '0';
  el.style.transition = 'opacity 320ms ease, transform 320ms ease';
  el.style.transform = 'translateY(6px)';
  requestAnimationFrame(()=>{ el.style.opacity = '1'; el.style.transform = 'translateY(0)'; el.style.color = success ? '' : '#b01c1c'; });
  setTimeout(()=>{ el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; setTimeout(()=> el.style.display = 'none', 320); }, 4000);
}

/* Theme */
const THEME_KEY = 'cillas_theme';
function initTheme(){ const saved = localStorage.getItem(THEME_KEY); if(saved === 'dark') document.documentElement.classList.add('dark'); document.querySelectorAll('[id^="themeToggle"]').forEach(btn => { btn.addEventListener('click', () => { const isDark = document.documentElement.classList.toggle('dark'); localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); }); }); }

/* Newsletter form handler (homepage) */
function initNewsletter(){
  const form = document.getElementById('newsletterForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('nlEmail');
    if(!email || !email.checkValidity()){ form.reportValidity(); return; }
    // mock subscribe: save to localStorage list (no backend)
    try{
      const key = 'cillas_news_subs_v1';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      if(!list.includes(email.value)) list.push(email.value);
      localStorage.setItem(key, JSON.stringify(list));
    }catch(_){ /* ignore */ }
    showInlineStatus('newsletterStatus', 'Thanks — you are subscribed!', true);
    form.reset();
  });
}

/* Cart count */
function updateCartCount(){ const cart = loadCart(); const count = Object.values(cart).reduce((s,n)=>s+(n||0),0); document.querySelectorAll('.cart-count').forEach(el=>el.textContent = count); const f = document.getElementById('floatingCartCount'); if(f) f.textContent = count; }

/* Small animation */
function animateCartAdd(){ updateCartCount(); }

/* Init page */
function initPage(){
  document.querySelectorAll('[id^="year"]').forEach(el=>el.textContent = new Date().getFullYear());
  renderFeatured(); renderProducts(); renderGallery(); renderCartPage(); renderCheckout(); renderOrderConfirmation();
  initContactForm(); initNewsletter(); initTheme(); updateCartCount();

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if(!add) return;
    // Prevent duplicate handling if a handler was already processing this button
    if(add.dataset.processing) return;
    try{ add.dataset.processing = '1'; add.setAttribute('aria-disabled','true'); add.disabled = true; }catch(_){ }
    addToCart(add.dataset.add,1);
    animateCartAdd();
    // release after short delay
    setTimeout(()=>{ try{ delete add.dataset.processing; add.removeAttribute('aria-disabled'); add.disabled = false; }catch(_){ } }, 250);
  });
}

document.addEventListener('DOMContentLoaded', initPage);
