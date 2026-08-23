/* =========================================================
   طبقة النسخة التجريبية (Prototype)
   ---------------------------------------------------------
   تُحمَّل بعد app.js وتُعدّل السلوك بما يناسب العرض التقديمي:
   • محاكاة موافقة المدير على طلب الدخول (بدل الانتظار الحقيقي)
   • تعطيل تسجيل الخروج التلقائي الساعة 6 مساءً
   • إبقاء جلسات وهمية «متصلة الآن» في تبويب المستخدمين
   • بطاقة دخول سريع بكل الأدوار + زر إعادة تعيين البيانات
   ملف مستقل تماماً — لا يُعدّل منطق التطبيق الأصلي.
   ========================================================= */
(function () {
  const CFG = window.APP_CONFIG || {};
  if (!CFG.DEMO_MODE) return;

  const q = (sel) => document.querySelector(sel);

  /* ---------- 1) محاكاة موافقة المدير على طلب الدخول ---------- */
  const origCreateLoginRequest = Store.createLoginRequest.bind(Store);
  Store.createLoginRequest = async function (userId, username, device) {
    const res = await origCreateLoginRequest(userId, username, device);
    if (res && res.id != null) {
      setTimeout(() => {
        Store.decideLoginRequest(res.id, true).catch(() => {});
      }, CFG.DEMO_AUTO_APPROVE_MS || 2200);
    }
    return res;
  };

  /* ---------- 2) تعطيل الخروج التلقائي الساعة 6 مساءً ---------- */
  if (CFG.DEMO_DISABLE_6PM_LOGOUT) {
    window.startSixPmWatch = function () {};
    window.stopSixPmWatch = function () {};
  }

  /* ---------- 3) إبقاء الجلسات الوهمية حيّة ---------- */
  setInterval(() => {
    try {
      const arr = JSON.parse(localStorage.getItem("active_sessions_v1") || "[]");
      let touched = false;
      arr.forEach((s) => {
        if (s.id >= 100 && !s.signed_out) { s.last_seen = new Date().toISOString(); touched = true; }
      });
      if (touched) localStorage.setItem("active_sessions_v1", JSON.stringify(arr));
    } catch (e) {}
  }, 30000);

  /* ---------- 4) بطاقة الدخول السريع ---------- */
  function renderDemoAccounts() {
    const box = q("#demo-accounts");
    if (!box || typeof DEMO_ACCOUNTS === "undefined") return;
    const card = box.closest(".login-card");
    if (card) card.classList.add("has-demo");
    box.innerHTML = `
      <div class="demo-accounts-head">
        <span class="demo-chip">نسخة تجريبية</span>
        <span>اختر دوراً للدخول مباشرةً — كلمة المرور: <b dir="ltr">1234</b></span>
      </div>
      <div class="demo-accounts-grid">
        ${DEMO_ACCOUNTS.map((a) => `
          <button type="button" class="demo-account" data-user="${a.user}">
            <span class="demo-account-label">${a.label}</span>
            <span class="demo-account-user" dir="ltr">${a.user}</span>
            <span class="demo-account-desc">${a.desc}</span>
          </button>`).join("")}
      </div>`;
    box.querySelectorAll(".demo-account").forEach((btn) => {
      btn.addEventListener("click", () => {
        q("#username").value = btn.getAttribute("data-user");
        q("#password").value = "1234";
        const form = q("#login-form");
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    });
  }
  renderDemoAccounts();

  /* ---------- 5) إعادة تعيين البيانات التجريبية ---------- */
  const resetBtn = q("#demo-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      confirmDialog(
        "إعادة تعيين النسخة التجريبية",
        "سيتم استرجاع كل البيانات التجريبية إلى حالتها الأصلية وإعادة تحميل الصفحة.",
        () => { resetDemoData(); location.reload(); },
        { yesLabel: "إعادة التعيين" }
      );
    });
  }
})();
