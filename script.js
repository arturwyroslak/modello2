/* Lightweight interactions: lazy loading, lightbox, form handling, smooth scroll */
document.addEventListener('DOMContentLoaded',function(){
  // Lazy loading
  const lazy = document.querySelectorAll('img.lazy');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const img = entry.target;
          const src = img.dataset.src;
          if(src){img.src = src; img.classList.remove('lazy');}
          obs.unobserve(img);
        }
      })
    },{rootMargin:'200px'});
    lazy.forEach(i=>io.observe(i));
  } else { // fallback
    lazy.forEach(i=>{i.src = i.dataset.src});
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){e.preventDefault(); target.scrollIntoView({behavior:'smooth'});}
    })
  });

  // Lightbox
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lb = document.getElementById('lightbox');
  const lbImage = lb.querySelector('.lb-image');
  const closeBtn = lb.querySelector('.lb-close');
  let current = -1;
  function openLightbox(index){
    const src = galleryItems[index].dataset.full;
    lbImage.src = src;
    lb.setAttribute('aria-hidden','false');
    current = index;
  }
  function closeLightbox(){lb.setAttribute('aria-hidden','true'); lbImage.src = '';}
  galleryItems.forEach((btn, i)=>btn.addEventListener('click',()=>openLightbox(i)));
  closeBtn.addEventListener('click',closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click',()=>{if(current>0)openLightbox(current-1)});
  lb.querySelector('.lb-next').addEventListener('click',()=>{if(current<galleryItems.length-1)openLightbox(current+1)});
  lb.addEventListener('click',(e)=>{if(e.target===lb)closeLightbox()});

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
