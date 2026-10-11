# Client Demo Prototypes

Two self-contained, presentation-ready demos. Both are static sites with no backend,
no API keys and no real customer data, published from this repository via GitHub Pages.

| Demo | Live | Source |
|---|---|---|
| **AZ Accounting** — Arabic receivables and invoicing, role-based | [`/`](https://ghassanmazen00.github.io/accounting-prototype/) | repository root |
| **Marshmallow** — Arabic retail: head office, warehouse, accounting, 15 branches | [`/marshmallow/`](https://ghassanmazen00.github.io/accounting-prototype/marshmallow/) | `marshmallow/` |

---

# Marshmallow — Retail System Demo

An Arabic, right-to-left demo of a three-in-one retail system for a 15-branch
womenswear chain: selling, stock and books in one place. Everything is fictional —
invented branches, staff, styles and figures.

Open it and use the switcher at the top. It has four workstations, one per role:

| Workstation | What it does |
|---|---|
| **الإدارة الرئيسية** | Dashboard, all 15 branches with full history, four control reports, plus read-only copies of the warehouse and the books |
| **شاشة المخزن** | Item master with size/colour variants, barcodes and pricing; goods receipts, transfers, stock counts |
| **شاشة المحاسب** | Opening balances, daily revenue and expenses, supplier and customer debts, chart of accounts, journal, trial balance, income statement, balance sheet |
| **شاشة الفرع** | The shop floor: sell, own stock, returns, and a rolling 30-day log |

### Things worth clicking

- **شاشة الفرع → البيع** — tap a garment and the size × colour grid opens showing that
  branch's availability. Pick a cell, build the invoice, complete the sale. Stock drops.
- **شاشة المخزن → الأصناف** — three ways to code an item: **+ صنف جديد** with the
  category's size/colour template already applied, **نسخ صنف موجود** which copies
  everything but the name, or **استيراد من ملف** for bulk CSV entry with a validated
  per-row preview. Codes and barcodes generate as you type, or you can code against the
  supplier's existing barcode instead.
- **شاشة المخزن → التحويلات** — move stock between the main warehouse and a branch.
  Both sides update, and the movement appears in the admin's movement log.
- **شاشة المحاسب → قيود اليومية → + قيد يدوي** — save stays disabled until debits equal
  credits. Post one and the trial balance and balance sheet both move.
- **الإدارة الرئيسية → الفروع → حركات كل الفروع** — every movement across all branches,
  filtered by date range, branch, movement type and free text.
- **الإدارة الرئيسية → التقارير** — goods shipped to each branch per day, sales against
  returns per branch, a running current-account statement per branch, and an item
  tracker that finds any style's quantity in all sixteen locations at once.
- **شاشة المخزن → أي صنف → ملصقات الباركود** — a printable label sheet, one label per
  size/colour, for the warehouse label printer. Items also take a photo, downscaled in
  the browser, which then shows in the stock table and on the till.
- **شاشة الفرع → البيع → ربط الأجهزة بالفرع** — a diagram and device-by-device checklist
  of how the scanner, receipt printer, cash drawer and label printer connect in a shop.

### How it is built

One HTML file, no framework and no build step. Deterministic seeded dummy data:
15 branches plus a central warehouse, 14 styles with ~196 variants, 90 days of movements
across five movement types, and a 21-account ledger. Opening balances per branch and per
supplier reconcile exactly to the opening journal entry.
Every report is derived from the journal rather than hard-coded, so the trial balance
foots and the balance sheet balances. Colour is deliberately absent — state is carried
by weight, fill and border instead, so the interface reads the same in light and dark.

**Not yet wired:** journals are generated monthly in aggregate rather than posted per
sale, and goods receipts, transfers and stock counts do not yet post to the ledger.

---

# AZ Accounting — Demo Prototype

A self-contained, presentation-ready version of the AZ Accounting web app, built for
showing the product to prospective customers.

It is the **same UI and the same application logic** as the production app, with the
backend swapped out for generated dummy data:

- **No backend.** No Supabase project, no API keys, no network calls. Everything runs
  in the browser using `localStorage`.
- **No real data.** Every customer, invoice, payment and amount is fabricated by a
  seeded generator (`js/demo-data.js`), so the demo looks identical every time.
- **No real accounts.** Six dummy logins, one per role, all with password `1234`.

---

## Running it

It is a static site — no build step, no dependencies.

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem also works.

To publish it for a customer, drop the folder on any static host
(GitHub Pages, Netlify, Vercel, or a plain web server).

---

## Demo logins

Click a role on the login screen to sign in instantly, or type the username manually.
Password for every account is `1234`.

| Username  | Role            | What it shows |
|-----------|-----------------|---------------|
| `manager` | المدير           | Full dashboard — clients, daily/monthly sales, activity, statements, all invoices, all payments, credit balances, cancelled invoices, login requests, active users |
| `worker0` | المشرف          | The manager's dashboard in read-only mode (no add/edit/delete) |
| `worker1` | موظف الإدخال     | Search customers, add invoices / payments / returns — all submitted for review |
| `worker2` | المراجِع         | Approve or reject the entries submitted by data-entry staff |
| `worker3` | مطّلِع           | Search-and-view only: customer balances, invoices, payments |
| `worker4` | عرض الفواتير     | Search a customer and view their invoices with limited columns |

### Suggested demo path

1. **`worker1`** — search a customer, add an invoice, watch it go to review.
2. **`worker2`** — approve that entry.
3. **`manager`** — the invoice is now in the ledger; walk through the dashboard tabs.
4. **`worker3` / `worker4`** — show the restricted read-only roles.
5. **`worker0`** — show the supervisor's read-only view of the full dashboard.

---

## Demo data

Generated by `js/demo-data.js` from a fixed seed, covering the last **150 days**:

- 21 customers (including the `نقدي` cash-sales account) — all fictional
- ~675 invoices with line items (fabric trade: description, size, quantity, price)
- ~270 payments, transfers, discounts and returns
- 9 cancelled invoices
- 3 entries pending review, 2 rejected entries, 2 pending login requests, 2 active sessions

Cash sales post to the `نقدي` account and are collected the same day, so that account
carries a zero balance and the receivables figures reflect credit customers only.
Fridays are treated as a weekly holiday — no activity is generated on them.

**Reset:** the *«إعادة تعيين البيانات»* button in the top bar restores the original
demo data — useful between customer meetings.

---

## How the demo differs from production

Everything below lives in `js/config.js` and `js/demo.js`. The application logic
(`js/app.js`, `js/store.js`) is unchanged from production.

| Behaviour | Production | Demo |
|---|---|---|
| Storage | Supabase (Postgres + RLS) | `localStorage` — `store.js` already had this fallback; it activates when the Supabase keys are blank |
| Authentication | Supabase Auth | Local username/password map in `js/data.js` |
| Manager approval of staff logins | Manager approves from their dashboard | Auto-approved after ~2.2s, so the waiting screen is demonstrated without a second browser |
| CAPTCHA (Cloudflare Turnstile) | Enabled | Disabled |
| 6 p.m. auto-logout for staff | Enabled | Disabled, so evening demos are not interrupted |
| Active sessions | Real heartbeats | Two simulated sessions kept alive |

---

## Files

```
index.html          markup — identical to production plus the demo login card and reset button
css/styles.css      production stylesheet + a demo section appended at the end
js/config.js        demo configuration (blank Supabase keys => local mode)
js/demo-data.js     seeded dummy-data generator
js/data.js          local storage layer + demo user accounts
js/store.js         data access layer — unchanged from production
js/app.js           application logic — unchanged from production
js/demo.js          demo-only behaviour (auto-approve, quick login, reset)
```
