# 🍰 Sugar Momma — Full-Stack Chef Portfolio

> **Premium pastry portfolio, e-commerce & booking platform**
> Built with Nuxt 3 · Supabase · PayMongo · Tailwind CSS · Deployed on Vercel

---

## 📦 What's Included

```
sugar-momma/
├── pages/                    # All public + admin pages
│   ├── index.vue             # Homepage with hero, featured recipes, CTAs
│   ├── recipes/index.vue     # Recipe blog with filters
│   ├── recipes/[slug].vue    # Single recipe with serving multiplier
│   ├── collections/index.vue # Premium collections grid
│   ├── orders.vue            # Custom order form + PayMongo
│   ├── classes.vue           # Chef bio + class listings
│   ├── contact.vue           # Contact form
│   ├── payment/success.vue   # Post-payment confirmation
│   └── admin/                # Protected admin panel
│       ├── login.vue         # Admin login
│       ├── index.vue         # Dashboard with stats
│       └── recipes/new.vue   # Full recipe uploader
├── components/               # All reusable Vue components
├── composables/              # Supabase helpers, useServings, useStorage
├── server/api/               # Nuxt server routes
│   ├── paymongo/webhook.post.ts  ← THE CRITICAL WEBHOOK
│   ├── paymongo/checkout.post.ts
│   ├── collections/unlock.post.ts
│   ├── orders/create.post.ts
│   ├── classes/book.post.ts
│   ├── admin/recipes.get.ts
│   ├── admin/recipes.post.ts
│   ├── newsletter.post.ts
│   └── contact.post.ts
├── supabase/
│   ├── schema.sql            ← Run this FIRST in Supabase
│   └── functions.sql         ← Run this SECOND
├── types/database.ts         # Full TypeScript types
├── middleware/admin.ts       # Admin route protection
├── assets/css/main.css       # Global styles + design tokens
├── tailwind.config.ts        # Full theme config
└── nuxt.config.ts            # Nuxt configuration
```

---

## 🚀 Step-by-Step Installation Guide

### PHASE 1: Supabase Setup (15 minutes)

**Step 1 — Create a Supabase project**
1. Go to https://supabase.com → Sign up / Log in
2. Click **"New Project"**
3. Set:
   - Project name: `sugar-momma`
   - Database password: (save this securely)
   - Region: Southeast Asia (Singapore) — closest to Philippines
4. Wait ~2 minutes for the project to provision

**Step 2 — Run the database schema**
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the contents of `supabase/schema.sql` and paste it in
4. Click **"Run"** (green button)
5. You should see "Success" — this creates all tables, RLS policies, and storage buckets
6. Repeat with `supabase/functions.sql`

**Step 3 — Create your admin user**
1. Go to **Authentication → Users** in your dashboard
2. Click **"Add User"** → **"Create New User"**
3. Enter your email and a strong password
4. After creation, go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET is_admin = TRUE
   WHERE email = 'your-admin-email@example.com';
   ```

**Step 4 — Get your API keys**
1. Go to **Settings → API** in your dashboard
2. Copy:
   - `Project URL` (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - `anon / public` key
   - `service_role` key (keep this secret — server-side only!)

---

### PHASE 2: PayMongo Setup (10 minutes)

**Step 5 — Create a PayMongo account**
1. Go to https://dashboard.paymongo.com → Sign up
2. For testing, use **Test Mode** (switch is in the top bar)
3. Go to **Developers → API Keys**
4. Copy:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Step 6 — Set up a Webhook**
1. Go to **Developers → Webhooks**
2. Click **"Add Webhook"**
3. URL: `https://YOUR-VERCEL-URL.vercel.app/api/paymongo/webhook`
   - (You'll update this after deploying to Vercel)
   - For local testing: use ngrok → `ngrok http 3000` → use the ngrok URL
4. Events to listen to:
   - ✅ `checkout_session.payment.paid`
5. Copy the **Webhook Secret** that appears

---

### PHASE 3: Local Development Setup (5 minutes)

**Step 7 — Clone and install**
```bash
# Unzip the project
unzip sugar-momma.zip
cd sugar-momma

# Install dependencies
npm install
```

**Step 8 — Configure environment variables**
```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your real values:
```env
# From Supabase → Settings → API
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   ← anon key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← service_role key

# From PayMongo → Developers → API Keys
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
PAYMONGO_WEBHOOK_SECRET=whsk_xxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# Your site URL
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Step 9 — Run the dev server**
```bash
npm run dev
```

Open http://localhost:3000 — you should see the Sugar Momma homepage!

Admin panel: http://localhost:3000/admin/login

---

### PHASE 4: Deploying to Vercel (10 minutes)

**Step 10 — Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sugar-momma.git
git push -u origin main
```

**Step 11 — Deploy on Vercel**
1. Go to https://vercel.com → Import Project
2. Connect your GitHub → Select `sugar-momma`
3. Framework: Nuxt.js (auto-detected)
4. Add all Environment Variables from your `.env` file
   - Change `NUXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://sugar-momma.vercel.app`)
5. Click **Deploy**

**Step 12 — Update PayMongo webhook URL**
1. Go back to PayMongo → Developers → Webhooks
2. Edit the webhook URL to: `https://your-vercel-url.vercel.app/api/paymongo/webhook`

---

### PHASE 5: Go Live Checklist

**Before launch:**
- [ ] Switch PayMongo from Test Mode → Live Mode and update all keys
- [ ] Add your real chef bio and photos in the classes page
- [ ] Upload your first recipe via the admin dashboard (`/admin/recipes/new`)
- [ ] Create at least one Collection via Supabase dashboard or admin UI
- [ ] Test the full payment flow end-to-end using PayMongo test cards
- [ ] Set up a custom domain on Vercel (Settings → Domains)
- [ ] Update `NUXT_PUBLIC_SITE_URL` to your custom domain

**PayMongo test cards:**
- Visa: `4343 4343 4343 4345` · Expiry: any future · CVC: any 3 digits
- GCash: Use test mode → any phone number works

---

## 💡 How the Payment Flow Works

```
User clicks "Unlock Collection"
    ↓
POST /api/collections/unlock
    ↓
Creates PayMongo Checkout Session with metadata:
  { type: "collection_purchase", collection_id, user_email }
    ↓
Returns checkout_url → user is redirected to PayMongo hosted page
    ↓
User pays (GCash / Card / PayMaya)
    ↓
PayMongo sends webhook to POST /api/paymongo/webhook
    ↓
Webhook verifies HMAC signature (security)
    ↓
Finds/creates user in Supabase Auth
    ↓
Inserts row into user_collection_access table
    ↓
RLS policies now allow that user to read premium recipes
```

---

## 🛠 Admin Usage Guide

**Accessing the admin panel:**
- URL: `https://yourdomain.com/admin/login`
- Use the email/password you set in Step 3

**Uploading a recipe:**
1. Go to `/admin/recipes/new`
2. Fill in the title (slug is auto-generated)
3. Upload banner and thumbnail images (they go to Supabase Storage)
4. Add ingredients using the dynamic rows: `[Qty] [Unit] [Name]`
5. Add steps using the instruction blocks (with optional step photos)
6. Click **"Save Draft"** to preview, or **"Publish"** to go live

**Creating a Premium Collection:**
1. Go to Supabase Dashboard → Table Editor → collections
2. Insert a new row with `is_published = true`
3. When creating a recipe, check **"Premium recipe"** and select the collection

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Complete DB schema + RLS policies |
| `server/api/paymongo/webhook.post.ts` | PayMongo webhook handler |
| `server/api/paymongo/checkout.post.ts` | Creates PayMongo sessions |
| `composables/useServings.ts` | Serving size multiplier logic |
| `composables/useStorage.ts` | Supabase Storage file uploads |
| `middleware/admin.ts` | Protects all /admin routes |
| `types/database.ts` | All TypeScript interfaces |

---

## 📞 Need Help?

- Supabase docs: https://supabase.com/docs
- Nuxt 3 docs: https://nuxt.com/docs
- PayMongo docs: https://developers.paymongo.com
- Tailwind CSS docs: https://tailwindcss.com/docs
#   S u g a r - M o m m a - C h e f - W e b s i t e  
 