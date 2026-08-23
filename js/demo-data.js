/* =========================================================
   مولّد البيانات التجريبية (Prototype)
   ---------------------------------------------------------
   كل الأسماء والأرقام هنا وهمية بالكامل ومولّدة برقم عشوائي
   ثابت (seed) — أي أن العرض التقديمي يظهر بنفس البيانات في
   كل مرة، ولا علاقة له بأي بيانات عملاء حقيقية.
   ========================================================= */

/* مولّد أرقام شبه‑عشوائية ثابت النتيجة */
function demoRand(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* أسماء عملاء وهمية (شركات وتجّار) */
const DEMO_CUSTOMER_NAMES = [
  "نقدي",
  "مصنع النيل للغزل والنسيج",
  "شركة الأمل للأقمشة",
  "محمد عبد الرحمن",
  "إخوان الشرقاوي",
  "تريكو الدلتا",
  "بيت الستائر الحديث",
  "مؤسسة البركة التجارية",
  "أحمد سليم وشركاه",
  "معرض الفردوس",
  "الرواد للمنسوجات",
  "حسن الجندي",
  "شركة الوفاء للتجارة",
  "ورشة النور للملابس",
  "مصنع الصفا",
  "خالد المنشاوي",
  "تجارة الشمس",
  "المتحدة للأقمشة",
  "سمير فتحي",
  "جروب الياسمين",
  "مخازن ابن سينا"
];

/* أصناف وهمية (أقمشة) — [الوصف، المقاس، أقل سعر، أعلى سعر] */
const DEMO_ITEMS = [
  ["قماش قطن مصري", "150 سم", 120, 180],
  ["تريكو قطن", "180 سم", 95, 140],
  ["جيرسيه سادة", "160 سم", 85, 120],
  ["دنيم ستريتش", "150 سم", 210, 320],
  ["ليكرا", "150 سم", 140, 190],
  ["شيفون مطبوع", "140 سم", 70, 110],
  ["ساتان حرير", "140 سم", 160, 240],
  ["كتان طبيعي", "150 سم", 190, 260],
  ["صوف مخلوط", "150 سم", 280, 380],
  ["بوليستر سادة", "160 سم", 55, 85],
  ["قطيفة", "140 سم", 230, 300],
  ["بطانة تفتة", "150 سم", 40, 65],
  ["شاش قطن", "90 سم", 30, 50],
  ["تول مطرز", "130 سم", 150, 220],
  ["كريب سادة", "145 سم", 90, 130],
  ["أورجانزا", "140 سم", 110, 160],
  ["مخمل قطن", "150 سم", 260, 340],
  ["قماش تنجيد", "280 سم", 320, 450],
  ["بامبو مانوفاتورا", "180 سم", 130, 190],
  ["استرتش ميلانو", "160 سم", 145, 200]
];

const DEMO_DAYS = 150;   // عدد الأيام التي تغطيها البيانات
const DEMO_SEED = 20260823;

/* بناء قاعدة البيانات التجريبية كاملة */
function buildDemoDB() {
  const rnd = demoRand(DEMO_SEED);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const intBetween = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const round5 = (n) => Math.round(n / 5) * 5;

  const customers = DEMO_CUSTOMER_NAMES.map((name, i) => ({ id: i + 1, name }));
  const cashId = 1; // «نقدي»
  const credit = customers.filter((c) => c.id !== cashId);

  const bills = [];
  const payments = [];
  const cancelled = [];
  let billSeq = 0, paySeq = 0, cancSeq = 0;
  let billDoc = 42000, payDoc = 70000, transferDoc = 3100, returnDoc = 91000;

  /* تاريخ منتصف اليوم بتوقيت مصر قبل «daysAgo» يوماً، بساعة عشوائية داخل الدوام */
  const dateFor = (daysAgo, hour, minute) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  /* يوم عمل (ليس جمعة) قبل «daysAgo» يوماً */
  const workDayAgo = (daysAgo) => {
    for (let k = 0; k < 7; k++) {
      const d = new Date();
      d.setDate(d.getDate() - (daysAgo + k));
      if (d.getDay() !== 5) return daysAgo + k;
    }
    return daysAgo;
  };

  const makeItems = (n) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const it = pick(DEMO_ITEMS);
      out.push({
        description: it[0],
        size: it[1],
        count: intBetween(15, 400),
        price: round5(intBetween(it[2], it[3]))
      });
    }
    return out;
  };

  /* ---------- الفواتير ---------- */
  for (let d = DEMO_DAYS; d >= 0; d--) {
    const day = new Date();
    day.setDate(day.getDate() - d);
    if (day.getDay() === 5) continue;               // إجازة الجمعة
    const busy = day.getDay() === 0 || day.getDay() === 1; // الأحد والاثنين أكثر ازدحاماً
    const count = intBetween(busy ? 5 : 3, busy ? 9 : 6);
    for (let i = 0; i < count; i++) {
      // ثلث المبيعات تقريباً نقدية
      const cust = rnd() < 0.33 ? customers[0] : pick(credit);
      const items = makeItems(intBetween(1, 4));
      const total = items.reduce((s, it) => s + it.count * it.price, 0);
      billSeq++;
      bills.push({
        id: billSeq,
        customerId: cust.id,
        date: dateFor(d, intBetween(9, 17), intBetween(0, 59)),
        items,
        total,
        docNo: String(billDoc++)
      });
    }
  }

  /* ---------- الدفعات والحركات الدائنة (للعملاء الآجلين فقط) ---------- */
  credit.forEach((c) => {
    const own = bills.filter((b) => b.customerId === c.id);
    if (!own.length) return;
    const billed = own.reduce((s, b) => s + b.total, 0);

    // نسبة السداد: أغلب العملاء يسدّدون جزءاً، وقلّة تسدّد بالزيادة (رصيد دائن)
    const r = rnd();
    const ratio = r < 0.30 ? 1.03 + rnd() * 0.15   // رصيد دائن (له) — يظهر في تبويب الأرصدة الدائنة
      : r < 0.38 ? 0.96 + rnd() * 0.06             // شبه مسدَّد
        : 0.42 + rnd() * 0.45;                     // عليه رصيد
    let remaining = billed * ratio;

    const n = intBetween(4, 12);
    for (let i = 0; i < n && remaining > 0; i++) {
      const daysAgo = workDayAgo(intBetween(0, DEMO_DAYS - 2));

      const roll = rnd();
      let kind = "payment";
      if (roll > 0.90) kind = "discount";
      else if (roll > 0.82) kind = "transfer";

      // الخصم مبلغ صغير مستقل؛ الدفعة/الترحيل يستهلكان الرصيد المتبقي
      let amount;
      if (kind === "discount") {
        amount = Math.min(round5(intBetween(300, 4000)), Math.max(500, round5(Math.round(remaining))));
      } else {
        const share = i === n - 1 ? remaining : remaining * (0.15 + rnd() * 0.35);
        amount = Math.max(500, round5(Math.round(share)));
      }
      remaining -= amount;   // يُخصم المبلغ الفعلي المسجَّل

      paySeq++;
      payments.push({
        id: paySeq,
        customerId: c.id,
        date: dateFor(daysAgo, intBetween(9, 17), intBetween(0, 59)),
        amount,
        note: kind === "discount" ? "خصم تسوية" : (kind === "transfer" ? "ترحيل رصيد" : ""),
        docNo: kind === "payment" ? String(payDoc++) : (kind === "transfer" ? "ك-" + transferDoc++ : ""),
        kind,
        items: []
      });
    }

    // مرتجعات لبعض العملاء
    if (rnd() < 0.35) {
      const items = makeItems(intBetween(1, 2));
      const total = items.reduce((s, it) => s + it.count * it.price, 0);
      paySeq++;
      payments.push({
        id: paySeq,
        customerId: c.id,
        date: dateFor(workDayAgo(intBetween(0, DEMO_DAYS - 5)), intBetween(9, 17), intBetween(0, 59)),
        amount: total,
        note: "",
        docNo: String(returnDoc++),
        kind: "return",
        items
      });
    }
  });

  /* ---------- تحصيل المبيعات النقدية ----------
     «نقدي» ليس عميلاً حقيقياً بل مخزن المبيعات النقدية، وتُحصَّل قيمته
     في نفس اليوم — فيُسجَّل تحصيل يومي مجمّع ليبقى رصيده صفراً. */
  const cashByDay = new Map();
  bills.filter((b) => b.customerId === cashId).forEach((b) => {
    const k = b.date.slice(0, 10);
    cashByDay.set(k, (cashByDay.get(k) || 0) + b.total);
  });
  [...cashByDay.entries()].forEach(([k, amount]) => {
    paySeq++;
    payments.push({
      id: paySeq,
      customerId: cashId,
      date: new Date(k + "T17:30:00").toISOString(),
      amount,
      note: "تحصيل مبيعات نقدية",
      docNo: String(payDoc++),
      kind: "payment",
      items: []
    });
  });

  /* ---------- الفواتير الملغية ---------- */
  const cancelReasons = [
    "خطأ في إدخال الكمية",
    "طلب العميل الإلغاء قبل الشحن",
    "تكرار الفاتورة بالخطأ",
    "خطأ في السعر المتفق عليه",
    "الصنف غير متوفر بالمخزن"
  ];
  for (let i = 0; i < 9; i++) {
    const items = makeItems(intBetween(1, 3));
    const total = items.reduce((s, it) => s + it.count * it.price, 0);
    cancSeq++;
    cancelled.push({
      id: cancSeq,
      docNo: String(intBetween(41000, 42000)),
      customerName: pick(credit).name,
      items,
      total,
      reason: pick(cancelReasons),
      date: dateFor(workDayAgo(intBetween(0, DEMO_DAYS)), intBetween(9, 17), intBetween(0, 59))
    });
  }

  bills.sort((a, b) => new Date(a.date) - new Date(b.date));
  payments.sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    customers,
    bills,
    payments,
    cancelled,
    seq: { bill: billSeq, payment: paySeq, cancelled: cancSeq }
  };
}

/* ---------- بيانات مساندة: إدخالات للمراجعة، طلبات دخول، جلسات نشطة ---------- */
function buildDemoPendingEntries(db) {
  const rnd = demoRand(DEMO_SEED + 7);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const credit = db.customers.filter((c) => c.name !== "نقدي");
  const now = Date.now();
  const ago = (min) => new Date(now - min * 60000).toISOString();

  const c1 = pick(credit), c2 = pick(credit), c3 = pick(credit);
  return [
    {
      id: 1, kind: "bill", customerId: c1.id, customerName: c1.name,
      payload: {
        items: [
          { description: "قماش قطن مصري", size: "150 سم", count: 120, price: 145 },
          { description: "بطانة تفتة", size: "150 سم", count: 200, price: 55 }
        ],
        total: 120 * 145 + 200 * 55,
        docNo: "42910"
      },
      createdBy: "worker1", status: "pending", created_at: ago(12)
    },
    {
      id: 2, kind: "payment", customerId: c2.id, customerName: c2.name,
      payload: { amount: 25000, note: "", docNo: "70420", kind: "payment" },
      createdBy: "worker1", status: "pending", created_at: ago(34)
    },
    {
      id: 3, kind: "return", customerId: c3.id, customerName: c3.name,
      payload: {
        items: [{ description: "شيفون مطبوع", size: "140 سم", count: 60, price: 95 }],
        total: 60 * 95, docNo: "91120", kind: "return"
      },
      createdBy: "worker1", status: "pending", created_at: ago(58)
    },

    /* إدخالات مرفوضة — تظهر في تبويب «المرفوضات» للمدير وللموظف */
    {
      id: 4, kind: "bill", customerId: c2.id, customerName: c2.name,
      payload: {
        items: [{ description: "دنيم ستريتش", size: "150 سم", count: 80, price: 265 }],
        total: 80 * 265, docNo: "42871"
      },
      createdBy: "worker1", status: "rejected", created_at: ago(190),
      decided_by: "worker2", decided_at: ago(178),
      reject_reason: "رقم الكشف مكرر — راجع فاتورة 42859"
    },
    {
      id: 5, kind: "payment", customerId: c1.id, customerName: c1.name,
      payload: { amount: 8000, note: "", docNo: "70388", kind: "payment" },
      createdBy: "worker1", status: "rejected", created_at: ago(320),
      decided_by: "worker2", decided_at: ago(305),
      reject_reason: "المبلغ غير مطابق لإيصال التحصيل"
    }
  ];
}

function buildDemoLoginRequests() {
  const now = Date.now();
  return [
    {
      id: 1, userId: "worker1", username: "worker1",
      device: "هاتف — Android — Chrome", status: "pending",
      created_at: new Date(now - 3 * 60000).toISOString()
    },
    {
      id: 2, userId: "worker3", username: "worker3",
      device: "حاسوب — Windows — Edge", status: "pending",
      created_at: new Date(now - 9 * 60000).toISOString()
    }
  ];
}

function buildDemoSessions() {
  const now = new Date().toISOString();
  return [
    { id: 101, userId: "worker2", username: "worker2", device: "حاسوب — Windows — Chrome", last_seen: now, signed_out: false },
    { id: 102, userId: "worker4", username: "worker4", device: "جهاز لوحي — iOS — Safari", last_seen: now, signed_out: false }
  ];
}
