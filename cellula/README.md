CELLULA - Digital Stem Cell Registry and Transplant Coordination

## Overview
- Centralized digital registry for stem cell donors and transplant coordination
- Built for the Nepal Stem Cell Research Centre to cut transplant delays and reduce manual workload
- Prototype/MVP focused on pilot testing and workflow validation

## Problems Addressed
- Fragmented/offline donor records and slow request approvals
- No real-time donor availability tracking, causing emergency delays
- Limited coordination between hospitals, registry staff, and donors

## Core Solution
- Web-based platform with role-based access (Admin, Hospital, Donor)
- Real-time donor database management with matching and notifications
- Request tracking with admin triage/prioritization

## Features by Role
- **Admin:** approve/triage hospital requests, manage donor records, oversee status and audit trails
- **Hospital/Transplant Unit:** submit and monitor stem cell requests, view matched donors, coordinate confirmations
- **Donor:** register with consent, maintain medical/profile data (blood group, HLA status, age, location), receive alerts

## How It Works (MVP)
- Frontend: React + TypeScript + Vite, styled with Tailwind CSS, Radix primitives, and shadcn-inspired UI
- State/persistence: browser localStorage only (suitable for demos/pilots; replace with secured backend for production)
- Routing: React Router with separate flows for admin, hospital, and donor views

## Project Status and Gaps
- Prototype/MVP ready for pilots
- Known gaps for production: authentication/SSO, secure backend with database, encrypted at-rest storage, real SMS/email delivery, full audit logging, backup/DR

## Getting Started (Local)
Prerequisites: Node.js 18+ or Bun. Bun is recommended because the repo ships with a `bun.lockb`.

1) Install dependencies
```
bun install
# or: npm install
```
2) Run the app in dev mode
```
bun run dev
# or: npm run dev
```
3) Build and preview
```
bun run build
bun run preview
# lint: bun run lint
```

## Scripts
- `dev` - start Vite dev server
- `build` - production build
- `build:dev` - development-mode build
- `preview` - preview built assets
- `lint` - run ESLint

## Project Layout (high level)
```
cellula/
	src/
		pages/           # route views (admin, hospital, donor dashboards & auth)
		components/      # UI primitives (shadcn/radix) and layout (Header/Footer)
		hooks/           # custom hooks (e.g., mobile detection, toast helpers)
		lib/             # shared utilities
		main.tsx         # app entry
		App.tsx          # router and layout composition
	public/            # static assets
	tailwind.config.ts # design tokens and Tailwind setup
	vite.config.ts     # bundler configuration
```

## Security and Compliance Notes
- Current MVP keeps data in localStorage; do not use for real patient/donor data
- Production should add: authenticated API with RBAC, encryption in transit/at rest, audit logging, consent tracking, retention policies, backups/DR, and vetted hosting

## Roadmap (suggested)
- Integrate secure backend (API + database) and real auth/SSO
- Implement audit logs, access reporting, and admin approvals with service-level targets
- Add reliable notifications (SMS/email) with delivery status
- Enhance donor availability updates and hospital coordination workflows
- Add observability (metrics/traces) and deployment automation

## Contact
Built for the Nepal Stem Cell Research Centre. For pilots or collaboration, coordinate with the project admins.


## ppt link : https://www.canva.com/design/DAG8rdozdaM/i_MRUNhNmwDdpdTANItisQ/view?utm_content=DAG8rdozdaM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8426fad43f 

sys arc : in public folder
vakkkkkkkkkkkk vayena yesto hawa taal ko vyo