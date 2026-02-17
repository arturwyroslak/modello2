/* Enhanced interactions: improved lazy loading (img + source), responsive srcset support, gallery filters, lightbox UX (wrap navigation), keyboard + swipe */

document.addEventListener('DOMContentLoaded',function(){
  // Lazy loading for <img class="lazy"> and <source data-srcset>
  const lazyImgs = Array.from(document.querySelectorAll('img.lazy'));
  const lazySources = Array.from(document.querySelectorAll('source[data-srcset]'));

  function applyLazyToImg(img){
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    if(srcset) img.srcset = srcset;
    if(src) img.src = src;
    img.classList.remove('lazy');
  }
  function applyLazyToSource(source){
    const srcset = source.dataset.srcset;
    if(srcset) source.srcset = srcset;
    source.removeAttribute('data-srcset');
  }

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          if(el.tagName.toLowerCase()==='img') applyLazyToImg(el);
          if(el.tagName.toLowerCase()==='source') applyLazyToSource(el);
          // if inside picture, trigger img load as well
          const pic = el.closest && el.closest('picture');
          if(pic){
            const pImg = pic.querySelector('img');
            if(pImg && pImg.dataset.src) applyLazyToImg(pImg);
          }
          obs.unobserve(el);
        }
      })
    },{rootMargin:'300px'});

    lazyImgs.forEach(i=>io.observe(i));
    lazySources.forEach(s=>io.observe(s));
  } else {
    // fallback immediate
    lazySources.forEach(applyLazyToSource);
    lazyImgs.forEach(applyLazyToImg);
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href');
      if(href==="#") return;
      const target = document.querySelector(href);
      if(target){e.preventDefault(); target.scrollIntoView({behavior:'smooth'});}
    })
  });

  // Gallery filter (improve ARIA selection handling)
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  filterBtns.forEach((btn,i)=>{
    btn.addEventListener('click',()=>{
      filterBtns.forEach(b=>{b.classList.remove('active'); b.setAttribute('aria-selected','false')});
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      const f = btn.dataset.filter;
      galleryItems.forEach((it,idx)=>{
        const cat = it.dataset.category;
        const show = (f==='all' || cat===f);
        it.style.display = show ? 'block' : 'none';
        it.setAttribute('aria-hidden', show ? 'false' : 'true');
      })
    })
  });

  // Lightbox with keyboard, swipe and wrap-around navigation
  const lb = document.getElementById('lightbox');
  const lbImage = lb.querySelector('.lb-image');
  const closeBtn = lb.querySelector('.lb-close');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');
  let current = -1;

  function openLightbox(index){
    // ensure index is within visible items
    const visible = galleryItems.filter(it=>it.style.display!=='none');
    if(visible.length===0) return;
    current = index;
    // map to actual visible index
    const item = galleryItems[current];
    lbImage.src = item.dataset.full;
    lb.setAttribute('aria-hidden','false');
    lb.focus();
  }
  function closeLightbox(){lb.setAttribute('aria-hidden','true'); lbImage.src = '';}

  galleryItems.forEach((btn, i)=>btn.addEventListener('click',()=>openLightbox(i)));
  closeBtn.addEventListener('click',closeLightbox);
  prevBtn.addEventListener('click',()=>{ if(current<=0) openLightbox(galleryItems.length-1); else openLightbox(current-1); });
  nextBtn.addEventListener('click',()=>{ if(current>=galleryItems.length-1) openLightbox(0); else openLightbox(current+1); });
  lb.addEventListener('click',(e)=>{ if(e.target===lb) closeLightbox() });

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown',e=>{
    if(lb.getAttribute('aria-hidden')==='false'){
      if(e.key==='Escape') closeLightbox();
      if(e.key==='ArrowLeft') prevBtn.click();
      if(e.key==='ArrowRight') nextBtn.click();
    }
  });

  // Swipe gestures (touch)
  let touchStartX = 0;
  lbImage.addEventListener('touchstart',e=>{ touchStartX = e.changedTouches[0].clientX });
  lbImage.addEventListener('touchend',e=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ if(dx>0) prevBtn.click(); else nextBtn.click(); }
  });

  // Contact form (fake submit) with aria updates
  const form = document.getElementById('contactForm');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    if(!data.get('consent')){ status.textContent='Proszę wyrazić zgodę na przetwarzanie danych.'; status.setAttribute('role','status'); return }
    status.textContent='Wysyłam…'; status.setAttribute('role','status');
    // Simulate network
    setTimeout(()=>{ status.textContent='Dziękuję! Wiadomość została wysłana.'; form.reset(); },900);
  });
});
