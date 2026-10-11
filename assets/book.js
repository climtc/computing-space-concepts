"use strict";
(() => {
  // 좁은 화면에서는 차례를 접어 두고 시작한다(js가 없으면 펼쳐진 채로 읽힌다)
  const mobileToc = document.querySelector(".toc-mobile");
  const narrow = window.matchMedia("(max-width:1000px)");
  if (mobileToc && narrow.matches) mobileToc.open = false;

  // 지금 읽는 절을 차례에 표시한다
  const links = [...document.querySelectorAll(".toc-group ol a")].filter(a => a.getAttribute("href").startsWith("#"));
  const targets = links.map(a => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  if (targets.length && "IntersectionObserver" in window) {
    const byId = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    let current = null;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          if (current) current.classList.remove("is-active");
          current = byId.get(en.target.id) || null;
          if (current) {
            current.classList.add("is-active");
            const group = current.closest("details");
            if (group && !group.open && !narrow.matches) group.open = true;
          }
        }
      });
    }, { rootMargin: "0px 0px -75% 0px" });
    targets.forEach(t => io.observe(t));
  }

  // 그림 전체 화면: 같은 iframe을 키운다(닫아도 모형 상태가 남는다). 지원하지 않으면 모형을 새 탭으로 연다
  document.addEventListener("click", ev => {
    const b = ev.target.closest(".ifig-fs");
    if (!b) return;
    const f = document.getElementById(b.dataset.target);
    const fs = f && (f.requestFullscreen || f.webkitRequestFullscreen);
    if (fs) fs.call(f);
    else if (b.dataset.fallback) window.open(b.dataset.fallback, "_blank", "noopener");
  });
})();
