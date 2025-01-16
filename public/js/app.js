let t1 = gsap.timeline()

t1.from(".navbar-brand,.nav-item,.d-flex", {
  y: -30,
  duration: 0.5,
  delay: 0.4,
  opacity: 0,
  stagger: 0.1,
});