# Flash Nexus — Deployment & Versioning

**Document Version:** 1.0  
**Last Updated:** June 2026  

---

## 1. Purpose

Flash Nexus is a **long-term SaaS platform** that will continue developing after production launch. Live users must keep working while new features ship. This document defines environments, versioning, migrations, backups, rollbacks, and safe deployment processes.

---

## 2. Environment Strategy

### 2.1 Three Environments

| Environment | Purpose | URL Pattern | Database |
|-------------|---------|-------------|----------|
| **Development** | Local coding, experimentation | `localhost:3000` | Local or dev Supabase project |
| **Staging** | Pre-production testing, QA | `staging.flashnexus.app` (TBD) | Staging Supabase project |
| **Production** | Live users | `app.flashnexus.app` (TBD) | Production Supabase project |

### 2.2 Environment Rules

| Rule | Description |
|------|-------------|
| **Never develop on production** | All code changes start in development |
| **Never test migrations on production first** | Migrations tested on dev → staging → production |
| **Separate Supabase projects** | One per environment, no shared databases |
| **Separate environment variables** | Each environment has its own `.env` |
| **Feature flags differ** | Staging may enable features before production |

### 2.3 Environment Variable Management

```
development:  .env.local (gitignored)
staging:      Vercel/hosting env vars (staging project)
production:   Vercel/hosting env vars (production project)

.env.example committed to repo (no secrets)
```

---

## 3. Git Branch Strategy

### 3.1 Branches

```
main (production)
  ↑
  merge from release/* or hotfix/*
  │
develop (staging)
  ↑
  merge from feature/*
  │
feature/module-name
  ↑
  developer work
```

| Branch | Deploys To | Merge From |
|--------|------------|------------|
| `main` | Production | `release/*`, `hotfix/*` |
| `develop` | Staging | `feature/*` |
| `feature/*` | Development (local) | — |
| `release/vX.Y.Z` | Staging (final test) | `develop` |
| `hotfix/*` | Production (emergency) | `main` |

### 3.2 Workflow

```
1. Create feature branch from develop
2. Develop and test locally
3. PR to develop → auto-deploy staging
4. Test on staging
5. Create release branch → final staging test
6. Merge release to main → deploy production
7. Tag version on main
8. Merge release back to develop
```

---

## 4. Release Versioning

### 4.1 Semantic Versioning

```
MAJOR.MINOR.PATCH

v1.0.0 — MVP release
v1.1.0 — Daily operations (cash shifts, closing)
v1.2.0 — Enhanced discovery
v1.3.0 — Smart tools
v2.0.0 — Global scale (breaking changes if any)
```

| Bump | When |
|------|------|
| MAJOR | Breaking changes, major architecture shift |
| MINOR | New features, new modules |
| PATCH | Bug fixes, small improvements |

### 4.2 Version Visibility

- App version shown in Settings → About
- Super Admin sees deployment version and timestamp
- API responses include `X-App-Version` header (future)

### 4.3 CHANGELOG.md

Maintain at project root:

```markdown
# Changelog

## [1.0.0] - 2026-XX-XX
### Added
- MVP release: financial engine, pricing, quotes, basic directory

## [0.4.0] - 2026-XX-XX
### Added
- Remittance pricing calculator
- Quote rate lock
```

Every release updates CHANGELOG before tagging.

---

## 5. Database Migration Rules

### 5.1 Core Principles

1. All schema changes via migration files
2. Migrations are **forward-only** in production
3. Migrations must be **backward-compatible** when possible
4. Never destructive changes in same release as deprecation
5. Test migrations on staging with production-like data volume

### 5.2 Migration File Location

```
supabase/migrations/
  20260618120000_create_offices.sql
  20260618130000_create_transactions.sql
  20260618140000_add_partner_fee_to_transactions.sql
```

### 5.3 Safe Migration Patterns

```sql
-- ✅ SAFE: Add nullable column
ALTER TABLE transactions ADD COLUMN partner_fee DECIMAL DEFAULT 0;

-- ✅ SAFE: Add new table
CREATE TABLE cut_rules ( ... );

-- ✅ SAFE: Add index concurrently (production)
CREATE INDEX CONCURRENTLY idx_transactions_office_date 
  ON transactions(office_id, transaction_date);

-- ⚠️ CAREFUL: Add NOT NULL column (requires default + backfill)
ALTER TABLE transactions ADD COLUMN cut_amount DECIMAL DEFAULT 0;
-- Then in next migration: ALTER ... SET NOT NULL

-- ❌ UNSAFE: Drop column in same release
ALTER TABLE transactions DROP COLUMN old_field;

-- ❌ UNSAFE: Rename column without alias period
ALTER TABLE transactions RENAME COLUMN amount TO total_amount;
```

### 5.4 Two-Release Deprecation

```
Release v1.1.0:
  - Add new_column
  - Application writes to both old and new
  - Application reads from new, falls back to old

Release v1.2.0:
  - Application only uses new_column
  - Migration drops old_column
```

### 5.5 Migration Tracking

| Environment | Tracking |
|-------------|----------|
| Supabase | Built-in migration history |
| Application | `schema_migrations` table or Supabase CLI |
| Super Admin | Future: migration status in System Operations module |

---

## 6. Backup Strategy

### 6.1 Database Backups

| Environment | Frequency | Retention |
|-------------|-----------|-----------|
| Production | Daily automatic (Supabase) | 30 days minimum |
| Staging | Weekly | 14 days |
| Development | Manual as needed | — |

### 6.2 Pre-Deployment Backup

Before every production deployment with migrations:

1. Verify latest automatic backup exists
2. Trigger manual backup (Supabase dashboard or CLI)
3. Record backup ID in deployment log
4. Proceed with deployment

### 6.3 File Storage Backups

- Supabase Storage: rely on Supabase backup policies
- Critical documents: consider periodic export to cold storage (future)

### 6.4 Backup Verification

- Monthly: restore backup to staging and verify data integrity
- Document restore procedure (see Rollback)

---

## 7. Rollback Strategy

### 7.1 Application Rollback

```
If deployment causes errors (no migration):

1. Revert to previous deployment on hosting platform
   (Vercel: instant rollback to previous deployment)
2. Verify application health
3. Investigate and fix on develop branch
```

### 7.2 Database Rollback

```
Migrations are forward-only. Rollback options:

1. PREFERRED: Deploy fix-forward migration
   - New migration corrects the issue
   - No data loss

2. EMERGENCY: Restore from pre-deployment backup
   - Data since backup will be lost
   - Requires maintenance window
   - Notify affected users

3. NEVER: Run "down" migrations in production
```

### 7.3 Rollback Decision Matrix

| Issue | Action |
|-------|--------|
| UI bug, no data impact | Rollback app deployment |
| Bad migration, no data corruption | Fix-forward migration |
| Data corruption | Restore backup + maintenance window |
| Security vulnerability | Immediate rollback + hotfix |

---

## 8. Feature Flags

### 8.1 Purpose

- Deploy code for unfinished modules without exposing to users
- Gradual rollout of risky features
- A/B testing (future)
- Per-office feature enablement (enterprise)

### 8.2 Implementation Levels

| Level | MVP | Future |
|-------|-----|--------|
| Code constants | ✅ `FEATURES.AI_PRICING = false` | |
| Environment variables | ✅ | |
| Database feature_flags table | | ✅ Per-office control |
| Super Admin UI | | ✅ System Operations module |

### 8.3 Feature Flag Workflow

```
1. Develop feature behind flag (disabled)
2. Deploy to staging with flag enabled
3. Test thoroughly
4. Deploy to production with flag disabled
5. Enable flag on staging for beta offices
6. Enable flag on production when ready
```

### 8.4 MVP Feature Flags

```typescript
export const FEATURES = {
  // Enabled in MVP
  CORE_FINANCIAL: true,
  REMITTANCE_PRICING: true,
  BASIC_DIRECTORY: true,
  BASIC_PARTNERS: true,

  // Disabled until later phases
  CASH_SHIFTS: false,
  DAILY_CLOSING: false,
  AI_CENTER: false,
  INTEGRATION_HUB: false,
  DEAL_TICKETS: false,
  SMART_IMPORT: false,
  SUBSCRIPTION_BILLING: false,
} as const;
```

---

## 9. Safe Deployment Process

### 9.1 Standard Deployment Checklist

```
PRE-DEPLOYMENT:
□ All tests pass on develop
□ Staging tested and approved
□ CHANGELOG updated
□ Version tag prepared
□ Database backup verified (if migrations included)
□ Migrations tested on staging
□ Feature flags set correctly for production
□ No destructive migrations

DEPLOYMENT:
□ Merge release branch to main
□ Tag version: git tag v1.0.0
□ Hosting platform deploys from main
□ Run migrations on production (if any)
□ Verify deployment health

POST-DEPLOYMENT:
□ Smoke test critical paths (login, dashboard, create transaction)
□ Monitor error logs for 30 minutes
□ Verify no migration errors
□ Announce release (if applicable)
```

### 9.2 Zero-Downtime Deployment

| Strategy | Application |
|----------|-------------|
| Backward-compatible migrations | New columns nullable; old code still works |
| Blue-green deployment | Hosting platform handles (Vercel) |
| Feature flags | New features hidden until enabled |
| No breaking API changes | Additive changes only between minor versions |

### 9.3 Deployment with Migrations

```
Order:
1. Deploy application code (backward compatible)
2. Run database migrations
3. Verify application works with new schema
4. Enable feature flag (if applicable)

If migration fails:
- Do NOT enable feature flag
- Assess: fix-forward or restore backup
```

---

## 10. Hosting Recommendations

### 10.1 Suggested Stack

| Component | Service |
|-----------|---------|
| Application | Vercel (Next.js optimized) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| DNS | Domain registrar (TBD) |
| Monitoring | Vercel Analytics + Sentry (future) |

### 10.2 Environment Mapping

| Environment | Vercel Project | Supabase Project |
|-------------|----------------|------------------|
| Development | Local | Dev project or local |
| Staging | flash-nexus-staging | Staging project |
| Production | flash-nexus | Production project |

---

## 11. CI/CD Pipeline (Future)

### 11.1 MVP: Manual Deployment

- Developer merges to develop → staging auto-deploy (Vercel)
- Manual promotion to production

### 11.2 Future: GitHub Actions

```yaml
# Conceptual pipeline
on push to develop:
  - lint
  - typecheck
  - run tests
  - deploy to staging

on push to main:
  - lint
  - typecheck
  - run tests
  - deploy to production
  - run migrations
  - notify team
```

---

## 12. Monitoring Production

### 12.1 MVP Monitoring

| What | How |
|------|-----|
| Application errors | Vercel error logs |
| Database errors | Supabase dashboard |
| Uptime | Manual checks |

### 12.2 Future Monitoring

| What | Tool |
|------|------|
| Error tracking | Sentry |
| Performance | Vercel Analytics |
| Database performance | Supabase metrics |
| Uptime | External ping service |
| Alerts | Email/Slack notifications |

---

## 13. Maintenance Windows

### 13.1 When Needed

- Database restore from backup
- Major migration that requires downtime
- Infrastructure changes

### 13.2 Procedure

```
1. Announce maintenance 48 hours in advance
2. Display maintenance banner in app
3. At scheduled time: enable maintenance mode
4. Perform work
5. Verify on staging equivalent
6. Disable maintenance mode
7. Announce completion
```

### 13.3 Goal

Minimize maintenance windows. Design for zero-downtime deployments.

---

## 14. System Operations Module (Future)

Super Admin module for:

- Current production version
- Last deployment timestamp
- Release history
- Migration status
- Backup status
- Feature flag management
- Deployment logs
- Rollback triggers

Planned in Phase 2 (admin UI), documented from Phase 0.

---

## 15. Deployment Log Template

```markdown
## Deployment: v1.0.0 — 2026-XX-XX

**Deployed by:** [name]
**Environment:** Production
**Backup ID:** [supabase backup id]
**Migrations:** 20260618_create_transactions.sql
**Feature flags changed:** REMITTANCE_PRICING enabled
**Rollback plan:** Revert to v0.5.0 deployment
**Smoke test:** ✅ Login, Dashboard, Create Transaction, Calculate Quote
**Issues:** None
```

---

*Safe deployment is not optional for a financial platform. Every production change follows this process.*
