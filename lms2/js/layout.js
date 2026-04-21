// ═══════════════════════════════════════════════════════
//  NEXUS LMS — Shared Layout Builder
//  Inyecta sidebar + topbar en todas las páginas
// ═══════════════════════════════════════════════════════

function buildAdminSidebar(activeItem) {
  const u = getSession();
  if (!u) return;
  const nav = [
    { id:"dashboard",   icon:"◈", label:"Dashboard",        href:"dashboard.html" },
    { id:"courses",     icon:"⊞", label:"Cursos",           href:"courses.html",   badge: NexusDB.courses.length },
    { id:"users",       icon:"◉", label:"Usuarios",         href:"users.html",     badge: NexusDB.users.length },
    { id:"submissions", icon:"◎", label:"Entregas",         href:"submissions.html", badge: NexusDB.submissions.filter(s=>s.status==="submitted").length },
    { id:"reports",     icon:"▦", label:"Reportes",         href:"reports.html" },
    { separator: true, label: "CONFIGURACIÓN" },
    { id:"branding",    icon:"◑", label:"Personalización",  href:"branding.html" },
    { id:"settings",    icon:"⚙", label:"Ajustes",          href:"settings.html" },
  ];
  injectSidebar(u, nav, activeItem, "admin");
}

function buildTeacherSidebar(activeItem) {
  const u = getSession();
  if (!u) return;
  const myCourses = NexusDB.courses.filter(c => c.teacherId === u.id);
  const pendingCount = NexusDB.submissions.filter(s => {
    const c = NexusDB.getCourse(s.courseId);
    return c?.teacherId === u.id && s.status === "submitted";
  }).length;
  const nav = [
    { id:"dashboard",   icon:"◈", label:"Dashboard",       href:"dashboard.html" },
    { id:"mycourses",   icon:"⊞", label:"Mis Cursos",      href:"mycourses.html", badge: myCourses.length },
    { id:"submissions", icon:"◎", label:"Entregas",        href:"submissions.html", badge: pendingCount },
    { separator: true, label: "HERRAMIENTAS" },
    { id:"rubrics",     icon:"▤", label:"Rúbricas",        href:"rubrics.html" },
    { id:"students",    icon:"◉", label:"Estudiantes",     href:"students.html" },
  ];
  injectSidebar(u, nav, activeItem, "teacher");
}

function buildStudentSidebar(activeItem) {
  const u = getSession();
  if (!u) return;
  const nav = [
    { id:"dashboard",  icon:"◈", label:"Mi Panel",        href:"dashboard.html" },
    { id:"courses",    icon:"⊞", label:"Mis Cursos",      href:"courses.html" },
    { id:"progress",   icon:"▦", label:"Mi Progreso",     href:"progress.html" },
    { id:"profile",    icon:"◉", label:"Mi Perfil",       href:"profile.html" },
  ];
  injectSidebar(u, nav, activeItem, "student");
}

function injectSidebar(user, nav, activeItem, role) {
  const p = NexusDB.platform;
  const logoHTML = p.logo
    ? `<img src="${p.logo}" style="width:38px;height:38px;object-fit:contain;border-radius:10px;">`
    : `<div class="sidebar-logomark">${p.logoText}</div>`;

  const navHTML = nav.map(item => {
    if (item.separator) return `<div class="sidebar-section">${item.label}</div>`;
    const badgeHTML = item.badge ? `<span class="badge-count">${item.badge}</span>` : "";
    return `<a class="sidebar-item${item.id === activeItem ? " active" : ""}" href="${item.href}">
      <span class="icon">${item.icon}</span>
      <span>${item.label}</span>
      ${badgeHTML}
    </a>`;
  }).join("");

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      ${logoHTML}
      <div class="sidebar-brand">
        <div class="name">${p.name}</div>
        <div class="inst">${p.institution}</div>
      </div>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="window.location.href='profile.html'">
        <div class="avatar avatar-sm" style="background:var(--p-light);color:var(--p-dark);">
          ${user.avatar ? `<img src="${user.avatar}" alt="">` : initials(user.name)}
        </div>
        <div style="flex:1;min-width:0;">
          <div class="name truncate">${user.name.split(" ")[0]}</div>
          <div class="role">${{admin:"Administrador",teacher:"Docente",student:"Estudiante"}[role]}</div>
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.3)">⋯</span>
      </div>
    </div>`;
  document.body.prepend(sidebar);
}

function buildTopbar(title, breadcrumbItems = []) {
  const topbar = document.createElement("div");
  topbar.className = "topbar";
  const bcHTML = breadcrumbItems.length
    ? breadcrumbItems.map((b, i) =>
        i === breadcrumbItems.length - 1
          ? `<span>${b}</span>`
          : `<a href="#" style="color:var(--dk4);">${b}</a> <span style="color:var(--border2)">›</span>`
      ).join(" ")
    : "";
  topbar.innerHTML = `
    <div class="topbar-left">
      <button class="btn btn-ghost btn-icon" id="sidebar-toggle" style="display:none;" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
      <div>
        <div class="topbar-title">${title}</div>
        ${bcHTML ? `<div class="breadcrumb">${bcHTML}</div>` : ""}
      </div>
    </div>
    <div class="topbar-right" id="topbar-right-slot"></div>`;
  document.querySelector(".main-content")?.prepend(topbar);

  // Responsive
  if (window.innerWidth <= 900) {
    document.getElementById("sidebar-toggle").style.display = "flex";
  }
}

// Tabs helper
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector || ".tabs");
  if (!container) return;
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");
    });
  });
}

// Modal helper
function openModal(id)  { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }
function initModals() {
  document.querySelectorAll(".modal-bg").forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) m.classList.remove("open"); });
  });
  document.querySelectorAll("[data-modal-close]").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal-bg")?.classList.remove("open"));
  });
}
