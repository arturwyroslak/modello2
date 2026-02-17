// Lightweight JS: lazy-load gallery, simple form submit (no backend)
const gallery = document.getElementById('gallery');
const images = Array.from({length:9}).map((_,i)=>`assets/portfolio-${i+1}.jpg`);

function createImage(src, idx){
  const img = document.createElement('img');
  img.dataset.src = src;
  img.alt = `Portfolio ${idx+1}`;
  img.loading = 'lazy';
  return img;
}

images.forEach((src,i)=>{const el=createImage(src,i);gallery.appendChild(el)});

// Simple lazy loader
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const img = entry.target; img.src = img.dataset.src; observer.unobserve(img);
      }
    })
  },{rootMargin:'200px'});
  document.querySelectorAll('#gallery img').forEach(img=>obs.observe(img));
} else {
  document.querySelectorAll('#gallery img').forEach(img=>img.src=img.dataset.src);
}

// contact form - demo only
const form = document.getElementById('contactForm');
const result = document.getElementById('formResult');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  result.textContent = 'Dziękuję! Twoja wiadomość została wysłana.';
  form.reset();
});
