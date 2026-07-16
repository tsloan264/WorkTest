# Dean's Petals & Produce

The website and ordering app for Dean's Petals & Produce — a self-serve farm stand
at 1934 Burlington Road, Akron, OH. Built with Next.js (App Router) and Supabase.

## What's here

- **Public site** — home page with live open/closed status, about/directions, a
  photo gallery, and a shop that lists every item with photos and prices.
- **Ordering** — customers can reserve items from the shop (pick items → submit
  contact info → come pay in person) or send a fully custom order request.
  Both, plus general contact messages, land in the admin dashboard and (once
  configured) trigger an email notification.
- **Admin dashboard** (`/admin`) — password-protected. Manage the open/closed
  status and hours, the product catalog (with photo upload), the gallery,
  site info (address, hours, social links, about text), and view/manage
  incoming orders.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables (see `.env.local`, already set up for the project's
Supabase instance):

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
  project connection. These are also baked in as fallback defaults in
  `src/lib/config.ts` (the anon key is safe to expose; Row Level Security on
  every table is what actually protects the data), so the app works even
  without a `.env.local`.
- `RESEND_API_KEY` — optional. Set this (a free [Resend](https://resend.com)
  account works) to get an email every time someone submits an order,
  reservation, or message. Without it, orders still land in the admin
  dashboard — you just won't get an email ping.
- `ORDER_NOTIFICATION_EMAIL` — where those emails go. Defaults to
  `tsloan264@gmail.com`.

## Admin login

Go to `/admin`, which redirects to `/admin/login`. Sign in with the admin
account created for this project, then use **Site Settings → Change Admin
Password** to set your own password.

## Deploying

This is a standard Next.js app — deploy it on [Vercel](https://vercel.com):

1. Import this GitHub repo into Vercel (New Project → Import Git Repository).
2. Leave the framework/build settings on their Next.js defaults.
3. (Optional) Add `RESEND_API_KEY` and `ORDER_NOTIFICATION_EMAIL` as
   Environment Variables if you want real email notifications, or want them
   to differ from the fallback defaults above.
4. Deploy. Every future push to the connected branch redeploys automatically.

## Database

All content (products, gallery photos, site settings, orders) lives in
Supabase Postgres, managed through the admin dashboard — no code changes
needed to update the catalog, swap photos, or change stand info day to day.
