// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmyDHuExUoG67zzb_A1tZP4XyHq5hZfvE",
  authDomain: "nexus-lms-b1bda.firebaseapp.com",
  projectId: "nexus-lms-b1bda",
  storageBucket: "nexus-lms-b1bda.firebasestorage.app",
  messagingSenderId: "333825878186",
  appId: "1:333825878186:web:3a6c76e620503e62ba08d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// LA FUNCIÓN DEL GUARDIA DE SEGURIDAD
export async function iniciarSesionSegura() {
  try {
    // 1. Abre la ventana de Google
    const resultado = await signInWithPopup(auth, provider);
    const emailUsuario = resultado.user.email;

    // 2. Busca al usuario en la base de datos
    const referenciaUsuario = doc(db, "usuarios_aprobados", emailUsuario);
    const datosUsuario = await getDoc(referenciaUsuario);

    // 3. Toma la decisión de enrutamiento
    if (datosUsuario.exists()) {
      // Extrae la información del usuario
      const datos = datosUsuario.data();
      const rolDelUsuario = datos.rol;

      // Redirige según el rol exacto
      if (rolDelUsuario === "admin") {
        window.location.href = "pages/admin/dashboard.html";
      } else if (rolDelUsuario === "teacher") {
        window.location.href = "pages/teacher/dashboard.html";
      } else if (rolDelUsuario === "student") {
        window.location.href = "pages/student/dashboard.html";
      } else {
        alert("Tu rol no está configurado correctamente en el sistema. Escríbenos a solicitudes.academicas@academia.cl");
        await signOut(auth);
      }
      
    } else {
      // Si el correo no existe en la base de datos
      alert("Acceso denegado: Los estudiantes nuevos serán vinculados a la plataforma en marzo. Recuerda utilizar tu correo institucional. Quedamos atentos ante cualquier otra duda en solicitudes.academicas@academia.cl.");
      await signOut(auth); // Lo expulsa
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}

// Asignar la función a la ventana global para que el botón HTML la pueda usar
window.iniciarSesionSegura = iniciarSesionSegura;
// ═══════════════════════════════════════════════════════
//  NEXUS LMS — Core Data Layer
//  Estado global, persistencia y helpers
// ═══════════════════════════════════════════════════════

const NexusDB = {

  // ── PLATAFORMA ──────────────────────────────────────
  platform: {
    name: "Nexus LMS",
    institution: "Instituto Ejemplo",
    logo: "",           // base64 o URL
    logoText: "NX",
    colors: { primary: "#00a499", accent: "#EA7600", dark: "#394049" },
    googleClientId: "YOUR_GOOGLE_CLIENT_ID",  // reemplazar en producción
    allowSelfRegister: false,
    defaultLanguage: "es"
  },

  // ── USUARIOS ────────────────────────────────────────
  users: [
    {
      id: "u1", googleId: "g_admin_001",
      name: "Administrador Principal", email: "admin@ejemplo.cl",
      avatar: "", role: "admin",
      bio: "Administrador de la plataforma.", phone: "",
      enrolledCourses: [], createdAt: "2025-01-01"
    },
    {
      id: "u2", googleId: "g_teacher_001",
      name: "Dra. Carmen Valdivia", email: "c.valdivia@ejemplo.cl",
      avatar: "", role: "teacher",
      bio: "Doctora en Ciencias de la Educación.", phone: "+56 9 1234 5678",
      enrolledCourses: [], createdAt: "2025-01-15"
    },
    {
      id: "u3", googleId: "g_student_001",
      name: "Alejandro Reyes", email: "a.reyes@ejemplo.cl",
      avatar: "", role: "student",
      bio: "Docente de matemáticas.", phone: "",
      enrolledCourses: ["c1","c2"],
      progress: { c1: { completedModules: [1], submissions: {}, lastAccess: "2025-04-18" },
                  c2: { completedModules: [], submissions: {}, lastAccess: "2025-04-15" } },
      createdAt: "2025-02-01"
    },
    {
      id: "u4", googleId: "g_student_002",
      name: "Valentina Morales", email: "v.morales@ejemplo.cl",
      avatar: "", role: "student",
      bio: "Profesora de lenguaje.", phone: "",
      enrolledCourses: ["c1"],
      progress: { c1: { completedModules: [1,2], submissions: {}, lastAccess: "2025-04-19" } },
      createdAt: "2025-02-01"
    }
  ],

  // ── CURSOS ──────────────────────────────────────────
  courses: [
    {
      id: "c1",
      title: "Formación Docente en Competencias Digitales",
      subtitle: "Integración de tecnología en el aula",
      description: "Programa intensivo orientado a desarrollar competencias digitales en docentes de educación básica y media. Incluye módulos prácticos, sesiones sincrónicas y proyecto final.",
      cover: "",           // URL imagen de portada
      coverGradient: "135deg, #00a499, #007f76",
      category: "Formación Docente",
      level: "Intermedio",
      duration: "8 semanas",
      teacherId: "u2",
      status: "active",    // draft | active | archived
      enrollmentOpen: true,
      maxStudents: 300,
      enrolledCount: 2,
      tags: ["tecnología", "docencia", "digitalización"],
      createdAt: "2025-01-20",
      updatedAt: "2025-04-01",
      modules: [
        {
          id: 1, order: 1,
          title: "Introducción y Marco Conceptual",
          description: "Fundamentos de la transformación digital en educación. Conoce al equipo y los objetivos del programa.",
          status: "published",   // draft | published | locked
          unlockAfter: null,     // id de módulo anterior requerido
          resources: [
            { id: "res-1-1", type: "pdf",     title: "Programa del Curso",            url: "#", size: "1.2 MB" },
            { id: "res-1-2", type: "genially", title: "Presentación Interactiva",      url: "https://view.genially.com/ejemplo1", thumbnail: "" },
            { id: "res-1-3", type: "video",   title: "Video de Bienvenida",            url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { id: "res-1-4", type: "link",    title: "Lectura complementaria",         url: "https://ejemplo.com/lectura1" }
          ],
          activities: [
            {
              id: "act-1-1", type: "forum",
              title: "Presentación personal",
              instructions: "Comparte tu nombre, institución donde trabajas y tus expectativas principales para este programa.",
              required: true,
              dueDate: "2025-05-05",
              rubric: null,
              maxScore: 10
            }
          ],
          syncSession: {
            title: "Sesión inaugural",
            date: "Martes 29 de abril, 18:30 hrs",
            zoomUrl: "https://zoom.us/j/ejemplo1",
            recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            description: "Presentación del equipo, revisión del programa y resolución de dudas."
          }
        },
        {
          id: 2, order: 2,
          title: "Diseño de Experiencias de Aprendizaje",
          description: "Estrategias y herramientas para diseñar experiencias significativas centradas en el estudiante con principios UDL.",
          status: "published",
          unlockAfter: 1,
          resources: [
            { id: "res-2-1", type: "pdf",     title: "Guía de Diseño UDL",            url: "#", size: "2.4 MB" },
            { id: "res-2-2", type: "genially", title: "Mapa Conceptual Interactivo",   url: "https://view.genially.com/ejemplo2", thumbnail: "" },
            { id: "res-2-3", type: "video",   title: "Clase grabada: Diseño UDL",      url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
          ],
          activities: [
            {
              id: "act-2-1", type: "assignment",
              title: "Diseña una secuencia didáctica",
              instructions: "Crea una secuencia para tu asignatura aplicando los principios UDL. Debe incluir: objetivo de aprendizaje, al menos 3 actividades diferenciadas y una propuesta de evaluación formativa.",
              required: true,
              dueDate: "2025-05-12",
              rubric: {
                title: "Rúbrica — Secuencia Didáctica UDL",
                criteria: [
                  { name: "Claridad del objetivo",  levels: ["No presenta objetivo","Objetivo vago","Objetivo claro","Objetivo claro y medible"], weights: [0,1,2,3] },
                  { name: "Aplicación de UDL",      levels: ["Sin evidencia UDL","Referencia superficial","Aplica 1-2 principios","Aplica 3+ principios con justificación"], weights: [0,1,2,3] },
                  { name: "Evaluación formativa",   levels: ["Sin propuesta","Propuesta genérica","Propuesta contextualizada","Propuesta con retroalimentación explícita"], weights: [0,1,2,3] },
                  { name: "Presentación y redacción", levels: ["Muy deficiente","Con errores","Aceptable","Cuidada y profesional"], weights: [0,1,2,3] }
                ]
              },
              maxScore: 100
            },
            {
              id: "act-2-2", type: "survey",
              title: "Encuesta de avance módulo 2",
              instructions: "Cuéntanos cómo va tu experiencia en este módulo.",
              required: false,
              dueDate: null,
              rubric: null,
              maxScore: null
            }
          ],
          syncSession: {
            title: "Sesión 2 — Diseño UDL",
            date: "Martes 6 de mayo, 18:30 hrs",
            zoomUrl: "https://zoom.us/j/ejemplo2",
            recordingUrl: "",
            description: "Taller práctico de diseño de secuencias con retroalimentación en vivo."
          }
        },
        {
          id: 3, order: 3,
          title: "Evaluación Auténtica y Formativa",
          description: "Métodos, rúbricas y portafolios para evaluar de manera formativa y auténtica.",
          status: "locked",
          unlockAfter: 2,
          resources: [],
          activities: [],
          syncSession: {
            title: "Sesión 3",
            date: "Martes 13 de mayo, 18:30 hrs",
            zoomUrl: "",
            recordingUrl: "",
            description: "Próximamente."
          }
        }
      ]
    },
    {
      id: "c2",
      title: "Liderazgo Pedagógico para Directivos",
      subtitle: "Gestión educativa con foco en aprendizajes",
      description: "Programa para directores y jefes técnicos orientado a fortalecer el liderazgo pedagógico y la gestión de equipos docentes.",
      cover: "",
      coverGradient: "135deg, #EA7600, #c45e00",
      category: "Liderazgo",
      level: "Avanzado",
      duration: "6 semanas",
      teacherId: "u2",
      status: "active",
      enrollmentOpen: true,
      maxStudents: 50,
      enrolledCount: 1,
      tags: ["liderazgo", "directivos", "gestión"],
      createdAt: "2025-02-10",
      updatedAt: "2025-04-05",
      modules: [
        {
          id: 1, order: 1,
          title: "El Rol del Director como Líder Pedagógico",
          description: "Marco conceptual del liderazgo pedagógico y su impacto en los resultados de aprendizaje.",
          status: "published",
          unlockAfter: null,
          resources: [
            { id: "res-c2-1-1", type: "pdf", title: "Marco LTSCI", url: "#", size: "3.1 MB" }
          ],
          activities: [
            {
              id: "act-c2-1-1", type: "reflection",
              title: "Autoevaluación de liderazgo",
              instructions: "Reflexiona sobre tu práctica directiva actual en relación al marco de liderazgo pedagógico presentado.",
              required: true, dueDate: "2025-05-08",
              rubric: null, maxScore: 10
            }
          ],
          syncSession: {
            title: "Sesión 1 — Liderazgo",
            date: "Miércoles 30 de abril, 17:00 hrs",
            zoomUrl: "https://zoom.us/j/ejemplo3",
            recordingUrl: "", description: ""
          }
        }
      ]
    },
    {
      id: "c3",
      title: "Convivencia Escolar y Resolución de Conflictos",
      subtitle: "Estrategias para ambientes de aprendizaje positivos",
      description: "Programa teórico-práctico orientado a docentes y asistentes de la educación.",
      cover: "",
      coverGradient: "135deg, #394049, #5a6472",
      category: "Convivencia",
      level: "Básico",
      duration: "4 semanas",
      teacherId: "u2",
      status: "draft",
      enrollmentOpen: false,
      maxStudents: 100,
      enrolledCount: 0,
      tags: ["convivencia", "conflictos", "clima escolar"],
      createdAt: "2025-03-01", updatedAt: "2025-03-20",
      modules: []
    }
  ],

  // ── SUBMISSIONS ────────────────────────────────────
  submissions: [
    {
      id: "sub-1", courseId: "c1", moduleId: 1, activityId: "act-1-1",
      userId: "u3", userName: "Alejandro Reyes",
      type: "forum",
      content: "Soy docente de matemáticas en el Liceo Bicentenario de La Florida. Mi principal expectativa es aprender herramientas digitales que me permitan hacer mis clases más dinámicas e inclusivas, especialmente para estudiantes con diferentes ritmos de aprendizaje.",
      fileUrl: null, fileName: null,
      submittedAt: "2025-04-18T14:32:00",
      status: "submitted",   // submitted | reviewed | graded
      score: null, feedback: "", rubricScores: null
    },
    {
      id: "sub-2", courseId: "c1", moduleId: 2, activityId: "act-2-1",
      userId: "u4", userName: "Valentina Morales",
      type: "assignment",
      content: "Secuencia para 8° básico, lenguaje: producción textual con diferenciación UDL.",
      fileUrl: "#", fileName: "secuencia_valdivia_mod2.pdf",
      submittedAt: "2025-04-19T09:15:00",
      status: "submitted",
      score: null, feedback: "", rubricScores: null
    }
  ],

  // ── HELPERS ────────────────────────────────────────
  getCourse(id) { return this.courses.find(c => c.id === id); },
  getUser(id)   { return this.users.find(u => u.id === id); },
  getUserByEmail(email) { return this.users.find(u => u.email === email); },
  getTeacher(courseId)  { const c = this.getCourse(courseId); return c ? this.getUser(c.teacherId) : null; },
  getCourseStudents(courseId) { return this.users.filter(u => (u.enrolledCourses||[]).includes(courseId)); },
  getCourseSubmissions(courseId) { return this.submissions.filter(s => s.courseId === courseId); },
  getStudentProgress(userId, courseId) {
    const u = this.getUser(userId);
    return u?.progress?.[courseId] || { completedModules: [], submissions: {}, lastAccess: null };
  },
  getCourseProgress(userId, courseId) {
    const c = this.getCourse(courseId);
    const prog = this.getStudentProgress(userId, courseId);
    if (!c) return 0;
    const published = c.modules.filter(m => m.status === "published").length;
    return published > 0 ? Math.round((prog.completedModules.length / published) * 100) : 0;
  }
};

// ── SESIÓN ────────────────────────────────────────────
function saveSession(user) { sessionStorage.setItem("nexus_session", JSON.stringify(user)); }
function getSession()      { const d = sessionStorage.getItem("nexus_session"); return d ? JSON.parse(d) : null; }
function logout()          { sessionStorage.clear(); window.location.href = "../index.html"; }

// Mock Google Sign-In para demo
function mockGoogleLogin(role) {
  const mock = {
    admin:   NexusDB.users.find(u => u.role === "admin"),
    teacher: NexusDB.users.find(u => u.role === "teacher"),
    student: NexusDB.users.find(u => u.role === "student")
  };
  const user = mock[role];
  if (user) { saveSession(user); redirectByRole(user); }
}

function redirectByRole(user) {
  if (user.role === "admin")   window.location.href = "pages/admin/dashboard.html";
  else if (user.role === "teacher") window.location.href = "pages/teacher/dashboard.html";
  else window.location.href = "pages/student/dashboard.html";
}

// ── UTILS ──────────────────────────────────────────────
function timeAgo(dateStr) {
  const d = new Date(dateStr), now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff/3600)} h`;
  return `hace ${Math.floor(diff/86400)} días`;
}

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}

function initials(name) {
  return (name || "?").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
}

function statusBadge(status) {
  const map = {
    active:    ["Activo",     "badge-success"],
    draft:     ["Borrador",   "badge-warn"],
    archived:  ["Archivado",  "badge-gray"],
    published: ["Publicado",  "badge-success"],
    locked:    ["Bloqueado",  "badge-gray"],
    submitted: ["Entregado",  "badge-info"],
    reviewed:  ["Revisado",   "badge-primary"],
    graded:    ["Calificado", "badge-success"]
  };
  const [label, cls] = map[status] || [status, "badge-gray"];
  return `<span class="badge ${cls}">${label}</span>`;
}

function typeIcon(type) {
  return { pdf:"📄", genially:"✨", video:"▶", link:"🔗", assignment:"📝", forum:"💬", survey:"📋", reflection:"💭" }[type] || "📌";
}
// --- Inicialización de la vista ---
document.getElementById("b-inst").textContent = NexusDB.platform.institution;
const s = getSession();
if (s) redirectByRole(s);