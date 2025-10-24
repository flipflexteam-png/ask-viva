;(() => {
  const year = document.getElementById("year")
  if (year) year.textContent = new Date().getFullYear()

  // Respect reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // Preloader
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader")
    if (pre) pre.classList.add("hide")
  })

  // Scroll reveal with staggered entrance animations
  const revealEls = document.querySelectorAll(".reveal")
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, idx) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view")
            e.target.style.setProperty("--a-delay", `${idx * 80}ms`)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    revealEls.forEach((el) => io.observe(el))
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"))
  }

  // Typing effect
  const typingWrap = document.querySelector(".hero-typing")
  const typingSpan = document.getElementById("typing")
  if (typingWrap && typingSpan && !prefersReduced) {
    const full = typingWrap.getAttribute("data-typing") || ""
    let i = 0
    const type = () => {
      if (i <= full.length) {
        typingSpan.textContent = full.slice(0, i)
        i++
        setTimeout(type, i < 12 ? 60 : 24)
      }
    }
    type()
  } else if (typingWrap && typingSpan) {
    typingSpan.textContent = typingWrap.getAttribute("data-typing") || ""
  }

  // Hero parallax
  const hero = document.querySelector(".hero")
  const parallax = () => {
    if (!hero) return
    const y = window.scrollY
    hero.style.backgroundPosition = `center ${Math.min(80, y * 0.25)}px`
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!prefersReduced) parallax()
    },
    { passive: true },
  )

  // Button ripple + grow
  const rippleButtons = document.querySelectorAll(".btn-animate-ripple")
  rippleButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.classList.remove("rippling")
      requestAnimationFrame(() => btn.classList.add("rippling"))
    })
    btn.addEventListener("mouseleave", () => btn.classList.remove("rippling"))
  })

  // Testimonials "carousel" scroll controls
  const track = document.querySelector(".testimonial-track")
  const prev = document.querySelector(".testimonial-prev")
  const next = document.querySelector(".testimonial-next")
  if (track && prev && next) {
    const scrollByCard = () => {
      const child = track.querySelector(":scope > *")
      const w = child ? child.getBoundingClientRect().width : 300
      return Math.max(240, Math.min(w + 16, 580))
    }
    prev.addEventListener("click", () => track.scrollBy({ left: -scrollByCard(), behavior: "smooth" }))
    next.addEventListener("click", () => track.scrollBy({ left: scrollByCard(), behavior: "smooth" }))
  }

  // Right-side scroll progress
  const progress = document.getElementById("scroll-progress")
  const onScroll = () => {
    if (!progress) return
    const st = window.scrollY
    const sh = document.documentElement.scrollHeight - window.innerHeight
    const pct = Math.max(0, Math.min(1, st / sh))
    progress.style.height = `${pct * 100}vh`
  }
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()

  // Subtle glowing cursor trail
  const trailRoot = document.getElementById("cursor-trail")
  if (trailRoot && !prefersReduced) {
    let lastX = 0,
      lastY = 0
    window.addEventListener(
      "mousemove",
      (e) => {
        const dx = Math.abs(e.clientX - lastX)
        const dy = Math.abs(e.clientY - lastY)
        if (dx + dy < 8) return
        lastX = e.clientX
        lastY = e.clientY
        const dot = document.createElement("div")
        dot.className = "cursor-dot"
        dot.style.left = `${e.clientX}px`
        dot.style.top = `${e.clientY}px`
        trailRoot.appendChild(dot)
        setTimeout(() => dot.remove(), 700)
      },
      { passive: true },
    )
  }

  // Improve dropdown hover intent on desktop by delaying hide
  const hovers = document.querySelectorAll(".dropdown-hover")
  hovers.forEach((item) => {
    let hideTimer
    const panel = item.querySelector(".hover-panel")
    if (!panel) return

    item.addEventListener("mouseenter", () => {
      clearTimeout(hideTimer)
      panel.style.display = "block"
      requestAnimationFrame(() => {
        panel.style.opacity = "1"
        panel.style.transform = "translateY(0)"
      })
    })

    item.addEventListener("mouseleave", () => {
      hideTimer = setTimeout(() => {
        panel.style.opacity = "0"
        panel.style.transform = "translateY(6px)"
        setTimeout(() => (panel.style.display = "none"), 180)
      }, 80)
    })
  })

  const cards = document.querySelectorAll(".service-card, .video-card")
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (prefersReduced) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    })
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
    })
  })

  const interactiveEls = document.querySelectorAll(
    ".btn-animate-ripple, .contact-oval-card, .service-card, .video-card",
  )
  interactiveEls.forEach((el) => {
    el.addEventListener("click", () => {
      if (prefersReduced) return
      el.style.animation = "pressDown 300ms ease"
      setTimeout(() => {
        el.style.animation = ""
      }, 300)
    })
  })

  const contactCards = document.querySelectorAll(".contact-oval-card")
  contactCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (prefersReduced) return
      card.style.animation = "glowPulse 1.5s ease infinite"
    })
    card.addEventListener("mouseleave", () => {
      card.style.animation = ""
    })
  })
})()
