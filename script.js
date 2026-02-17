/* Enhanced interactions: lazy loading with srcset support, gallery filters, swipe gestures for lightbox, keyboard navigation */

document.addEventListener('DOMContentLoaded',function(){
  // Lazy loading with srcset handling
  const lazyImgs = document.querySelectorAll('img.lazy');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const img = entry.target;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;
          if(srcset){
            img.srcset = srcset;
          }
          if(src){img.src = src;}
          img.classList.remove('lazy');
          obs.unobserve(img);
        }
      })
    },{rootMargin:'200px'});
    lazyImgs.forEach(i=>io.observe(i));
  } else { // fallback
    lazyImgs.forEach(i=>{if(i.dataset.srcset)i.srcset=i.dataset.srcset; i.src=i.dataset.src});
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault(); target.scrollIntoView({behavior:'smooth'});}
    })
  });

  // Gallery filter
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    galleryItems.forEach(it=>{
      const cat = it.dataset.category;
      if(f==='all' || cat===f){it.style.display='block';} else {it.style.display='none';}
    })
  }));

  // Lightbox with keyboard and swipe
  const lb = document.getElementById('lightbox');
  const lbImage = lb.querySelector('.lb-image');
  const closeBtn = lb.querySelector('.lb-close');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');
  let current = -1;
  function openLightbox(index){
    const src = galleryItems[index].dataset.full;
    lbImage.src = src;
    lb.setAttribute('aria-hidden','false');
    lb.focus();
    current = index;
  }
  function closeLightbox(){lb.setAttribute('aria-hidden','true'); lbImage.src = '';}
  galleryItems.forEach((btn, i)=>btn.addEventListener('click',()=>openLightbox(i)));
  closeBtn.addEventListener('click',closeLightbox);
  prevBtn.addEventListener('click',()=>{if(current>0)openLightbox(current-1)});
  nextBtn.addEventListener('click',()=>{if(current<galleryItems.length-1)openLightbox(current+1)});
  lb.addEventListener('click',(e)=>{if(e.target===lb)closeLightbox()});

  // Keyboard
  document.addEventListener('keydown',e=>{
    if(lb.getAttribute('aria-hidden')==='false'){
      if(e.key==='Escape')closeLightbox();
      if(e.key==='ArrowLeft')prevBtn.click();
      if(e.key==='ArrowRight')nextBtn.click();
    }
  });

  // Swipe gestures (touch)
  let touchStartX = 0;
  lbImage.addEventListener('touchstart',e=>{touchStartX = e.changedTouches[0].clientX});
  lbImage.addEventListener('touchend',e=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ if(dx>0) prevBtn.click(); else nextBtn.click(); }
  });

  // Contact form (fake submit)
  const form = document.getElementById('contactForm');
  const status = form.querySelector('.form-status');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(form);
    if(!data.get('consent')){status.textContent='Proszę wyrazić zgodę na przetwarzanie danych.';return}
    status.textContent='Wysyłam…';
    // Simulate network
    setTimeout(()=>{status.textContent='Dziękuję! Wiadomość została wysłana.';form.reset()},900);
  });
});
