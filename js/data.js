/* =========================================================
   طبقة البيانات — النسخة التجريبية
   ---------------------------------------------------------
   تعمل بالكامل داخل المتصفح (localStorage). لا يوجد أي اتصال
   بقاعدة بيانات، وكل البيانات وهمية ومولّدة من js/demo-data.js
   ========================================================= */

const DB_KEY = "az_demo_db_v1";

/* حسابات الدخول التجريبية — كلمة المرور واحدة للجميع: 1234 */
const USERS = {
  "manager": { password: "1234", role: "manager",    name: "المدير" },
  "worker0": { password: "1234", role: "supervisor", name: "المشرف" },
  "worker1": { password: "1234", role: "employee",   name: "موظف الإدخال" },
  "worker2": { password: "1234", role: "employee",   name: "المراجِع" },
  "worker3": { password: "1234", role: "employee",   name: "مطّلِع" },
  "worker4": { password: "1234", role: "employee",   name: "عرض الفواتير" }
};

/* وصف كل حساب — يُستخدم في بطاقة الدخول السريع بشاشة تسجيل الدخول */
const DEMO_ACCOUNTS = [
  { user: "manager", label: "المدير",        desc: "لوحة كاملة: العملاء، المبيعات، الكشوف، الصلاحيات" },
  { user: "worker0", label: "المشرف",        desc: "نفس لوحة المدير للاطّلاع فقط دون تعديل" },
  { user: "worker1", label: "موظف الإدخال",  desc: "يضيف الفواتير والدفعات وتُرسَل للمراجعة" },
  { user: "worker2", label: "المراجِع",      desc: "يعتمد أو يرفض إدخالات الموظفين" },
  { user: "worker3", label: "مطّلِع",        desc: "بحث واطّلاع على أرصدة العملاء فقط" },
  { user: "worker4", label: "عرض الفواتير",  desc: "عرض فواتير العميل بأعمدة محدودة" }
];

/* تهيئة قاعدة البيانات لأول مرة (أو بعد إعادة التعيين) */
function initDB() {
  let db = loadDB();
  if (!db) {
    db = buildDemoDB();
    saveDB(db);
    seedDemoAux(db);
  }
  if (!db.cancelled) db.cancelled = [];
  if (db.seq && db.seq.cancelled == null) db.seq.cancelled = 0;
  return db;
}

/* زرع البيانات المساندة (مراجعات، طلبات دخول، جلسات) */
function seedDemoAux(db) {
  try {
    localStorage.setItem("pending_entries_v1", JSON.stringify(buildDemoPendingEntries(db)));
    localStorage.setItem("login_requests_v1", JSON.stringify(buildDemoLoginRequests()));
    localStorage.setItem("active_sessions_v1", JSON.stringify(buildDemoSessions()));
  } catch (e) {}
}

/* إعادة تعيين النسخة التجريبية إلى حالتها الأصلية */
function resetDemoData() {
  try {
    ["pending_entries_v1", "login_requests_v1", "active_sessions_v1", DB_KEY]
      .forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
}

/* قراءة/كتابة قاعدة البيانات */
function loadDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)); }
  catch (e) { return null; }
}
function saveDB(db) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  catch (e) {}
}
