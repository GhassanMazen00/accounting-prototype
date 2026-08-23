/* =========================================================
   إعدادات النسخة التجريبية (Prototype / Demo)
   ---------------------------------------------------------
   SUPABASE_URL و SUPABASE_ANON_KEY فارغان عمداً:
   عند تركهما فارغين تعمل طبقة التخزين (store.js) بالوضع المحلي
   (localStorage) — أي أن النسخة التجريبية تعمل بالكامل داخل
   المتصفح دون أي اتصال بقاعدة بيانات حقيقية ودون أي بيانات عملاء.
   ========================================================= */
window.APP_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  AUTH_EMAIL_DOMAIN: "azacounting.app",

  REVIEWER_USERNAME: "worker2",      // المراجِع
  VIEWER_USERNAME: "worker3",        // الاطّلاع فقط
  SUPERVISOR_USERNAME: "odai",       // المشرف
  BILLS_VIEWER_USERNAME: "worker4",  // عرض الفواتير فقط

  CAPTCHA_SITE_KEY: "",              // مُعطّل في النسخة التجريبية

  /* ---------- خيارات خاصة بالنسخة التجريبية ---------- */
  DEMO_MODE: true,
  DEMO_AUTO_APPROVE_MS: 2200,        // محاكاة موافقة المدير على طلب الدخول
  DEMO_DISABLE_6PM_LOGOUT: true      // تعطيل الخروج التلقائي 6 مساءً أثناء العرض
};
