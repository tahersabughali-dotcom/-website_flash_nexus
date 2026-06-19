# Flash Nexus — Security & Permissions

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Authority:** Mandatory for all development

---

## 1. Security Philosophy

Flash Nexus handles **financial data** for multiple independent businesses. Security failures can cause:

- Cross-tenant data leakage (Office A sees Office B's transactions)
- Unauthorized financial modifications
- Client exposure to internal office data
- Audit trail tampering
- Reputational and legal damage

Security is enforced at **multiple layers**: database (RLS), server (permissions), and UI (visibility).

### 1.1 Supabase Auth vs Application Roles

Flash Nexus uses two distinct role layers:

| Layer | Source | Examples | Enforced by |
|-------|--------|----------|-------------|
| **Supabase Auth role** | JWT / `auth.users` | `authenticated`, `anon` | Supabase Auth + RLS policies |
| **Application role** | `office_members.role`, `profiles.account_type` | `owner`, `accountant`, `super_admin` | RLS subqueries, server guards, services |

- **Supabase Auth** proves identity (who is logged in).
- **Application roles** prove authorization (what they can do in which office).
- UI role checks are **supplementary** — never the only enforcement layer.

### 1.2 Supabase RLS Requirement (Mandatory)

From Phase 2B onward:

1. **RLS must be enabled** on every table holding tenant or user data.
2. **Policies must use `auth.uid()`** and office membership (`office_members`) where applicable.
3. **Normal user operations** use the anon/authenticated client — subject to RLS.
4. **Service role / admin client** bypasses RLS and is **server-only** for platform tasks — not for office staff workflows.
5. **Storage buckets** for attachments must have RLS-equivalent policies (Phase 3+).

See `flash-nexus/database/README.md` and `docs/PHASE_2A_SUPABASE_PREP.md`.

### 1.3 Tenant Isolation Requirement

1. Every tenant-scoped row includes **`office_id`** (except global reference tables).
2. Every query from application code filters by **`office_id`** for the active office.
3. **RLS is the primary enforcement**; server-side tenant guards (`lib/tenant/`) are a secondary check.
4. **Cross-tenant access is forbidden** — Office A must never read Office B data except explicit shared/partner flows (future deal tickets).

---

## 2. Role Definitions

### 2.1 Platform Roles

| Role | Scope | Description |
|------|-------|-------------|
| **Super Admin** | Platform-wide | SaaS owner, all offices, system settings |

### 2.2 Office Roles

| Role | Scope | Description |
|------|-------|-------------|
| **Office Owner** | Own office | Full control, cannot be removed by others |
| **Financial Manager** | Own office | Reports, approvals, capital/liquidity view |
| **Accountant** | Own office | Transaction entry, attachments, limited reports |
| **Cashier** | Own office | Cash box, shifts, receipts |
| **Auditor** | Own office | Read-only audit access |

### 2.3 External Roles

| Role | Scope | Description |
|------|-------|-------------|
| **Client** | Own data + public directory | Marketplace user |
| **Partner Office** | Shared operations only | Another office in partnership |
| **AI Assistant** | Suggest only | Future, no write access |

---

## 3. Permission Matrix

### 3.1 Permission Naming Convention

```
{entity}.{action}

Examples:
  transaction.create
  transaction.edit
  transaction.void
  transaction.approve
  transaction.view
  quote.create
  quote.convert
  client.create
  client.view
  cut_rule.edit
  report.view_profit
  office.settings
  user.invite
  partnership.request
```

### 3.2 Office Role Permissions

| Permission | Owner | Fin. Manager | Accountant | Cashier | Auditor |
|------------|-------|--------------|------------|---------|---------|
| **Transactions** |
| transaction.create | ✅ | ✅ | ✅ | ✅ | ❌ |
| transaction.edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| transaction.void | ✅ | ✅ | ❌ | ❌ | ❌ |
| transaction.approve | ✅ | ✅ | ❌ | ❌ | ❌ |
| transaction.view | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Quotes & Pricing** |
| quote.create | ✅ | ✅ | ✅ | ❌ | ❌ |
| quote.convert | ✅ | ✅ | ✅ | ❌ | ❌ |
| cut_rule.edit | ✅ | ❌ | ❌ | ❌ | ❌ |
| fee_rule.edit | ✅ | ✅ | ❌ | ❌ | ❌ |
| rate.override | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Clients** |
| client.create | ✅ | ✅ | ✅ | ❌ | ✅ |
| client.edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| client.view | ✅ | ✅ | ✅ | ✅ | ✅ |
| client.view_notes | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Reports** |
| report.view_daily | ✅ | ✅ | ✅ | ✅ | ✅ |
| report.view_profit | ✅ | ✅ | ❌ | ❌ | ✅ |
| report.view_capital | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Administration** |
| user.invite | ✅ | ❌ | ❌ | ❌ | ❌ |
| user.manage_roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| office.settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Audit** |
| audit.view | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Cash** |
| shift.open | ✅ | ✅ | ❌ | ✅ | ❌ |
| shift.close | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Partners** |
| partnership.request | ✅ | ✅ | ❌ | ❌ | ❌ |
| partnership.manage | ✅ | ❌ | ❌ | ❌ | ❌ |

### 3.3 Super Admin Permissions

| Permission | Super Admin |
|------------|-------------|
| office.view_all | ✅ |
| office.suspend | ✅ |
| office.verify | ✅ |
| platform.settings | ✅ |
| feature_flag.manage | ✅ |
| subscription.manage | ✅ |
| system.deploy | ✅ |
| audit.view_all | ✅ |
| **Financial records** | ❌ No direct edit |

**Rule:** Super Admin manages platform, not office financial data.

### 3.4 Client Permissions

| Permission | Client |
|------------|--------|
| directory.search | ✅ |
| office.view_public | ✅ |
| quote_request.create | ✅ |
| own.invoice.view | ✅ |
| own.receipt.view | ✅ |
| own.request.view | ✅ |
| office.internal.view | ❌ |
| transaction.view | ❌ |
| report.view | ❌ |

### 3.5 Partner Office Permissions

| Permission | Partner (when active partnership) |
|------------|-----------------------------------|
| partner.profile.view | ✅ |
| partner.services.view | ✅ |
| partnership.terms.view | ✅ |
| deal_ticket.view_shared | ✅ (future) |
| deal_ticket.create | ✅ (future) |
| settlement.view_shared | ✅ (future) |
| office.internal.view | ❌ |
| client.list.view | ❌ |
| transaction.view_all | ❌ |

---

## 4. Data Isolation

### 4.1 Multi-Tenant Model

```
Every tenant-scoped table has office_id column.
Every query filters by office_id.
RLS policies enforce at database level.
Server-side code double-checks office membership.
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- Conceptual RLS policy for transactions
CREATE POLICY "office_members_can_view_transactions"
  ON transactions FOR SELECT
  USING (
    office_id IN (
      SELECT office_id FROM office_members
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "authorized_members_can_insert_transactions"
  ON transactions FOR INSERT
  WITH CHECK (
    office_id IN (
      SELECT om.office_id FROM office_members om
      JOIN role_permissions rp ON om.role = rp.role
      WHERE om.user_id = auth.uid()
        AND om.is_active = true
        AND rp.permission = 'transaction.create'
    )
  );
```

### 4.3 Tables Requiring RLS

| Table | Isolation Key |
|-------|---------------|
| clients | office_id |
| accounts | office_id |
| transactions | office_id |
| quotes | office_id |
| cut_rules | office_id |
| fee_rules | office_id |
| corridors | office_id |
| exchange_rates | office_id |
| invoices | office_id |
| audit_logs | office_id |
| office_members | office_id |
| attachments | office_id |
| partnerships | requesting_office_id OR receiving_office_id |

### 4.4 Cross-Tenant Access Prevention

| Scenario | Prevention |
|----------|------------|
| User guesses transaction UUID | RLS blocks: not member of that office |
| API call with wrong office_id | Server validates membership |
| Client accesses office data | No office_members record → blocked |
| Partner sees other office data | Only shared deal records accessible |

---

## 5. Financial Protection

### 5.1 Immutable Records

| Record Type | Protection |
|-------------|------------|
| Transactions | No DELETE; void/reversal only |
| Audit logs | Append-only; no UPDATE/DELETE |
| Exchange rate history | Append-only |
| Cut/fee rule audit | Append-only |

### 5.2 Database-Level Protection

```sql
-- Revoke DELETE on financial tables from application role
REVOKE DELETE ON transactions FROM authenticated;
REVOKE DELETE ON audit_logs FROM authenticated;
REVOKE UPDATE ON audit_logs FROM authenticated;

-- Only service role can run migrations
-- Application uses authenticated role with RLS
```

### 5.3 Approval Authority

| Action | Minimum Role |
|--------|-------------|
| Approve transaction | Financial Manager |
| Void transaction | Financial Manager |
| Override exchange rate | Financial Manager |
| Edit cut rules | Office Owner |
| Daily closing approval | Office Owner or Financial Manager |
| Partnership acceptance | Office Owner |

### 5.4 Separation of Duties

| Rule | Implementation |
|------|----------------|
| Creator ≠ Approver (configurable) | Check on approval |
| Accountant cannot void | Permission denied |
| Auditor cannot edit | Read-only role |
| AI cannot approve | No write permissions for AI role |

---

## 6. Authentication Security

### 6.1 Supabase Auth

| Feature | MVP | Future |
|---------|-----|--------|
| Email/password | ✅ | |
| Email verification | ✅ | |
| Password reset | ✅ | |
| Session management | ✅ | |
| 2FA | ❌ | P2 |
| SSO | ❌ | Enterprise |

### 6.2 Session Rules

- JWT tokens with reasonable expiry
- Refresh token rotation
- Logout invalidates session
- No sensitive data in JWT payload

### 6.3 Password Policy

- Minimum 8 characters
- Supabase default strength requirements
- Future: configurable per office

---

## 7. API & Server Security

### 7.1 Server-Side Validation

```
All mutations go through server actions or API routes.
Never trust client-side validation alone.
Zod schemas validate all inputs.
Permission checks before any mutation.
office_id verified on every request.
```

### 7.2 Service Role Key Protection

```
SUPABASE_SERVICE_ROLE_KEY:
  - Server-side only (API routes, server actions)
  - Never in client bundle
  - Never in NEXT_PUBLIC_* variables
  - Used only for admin operations and migrations
```

### 7.3 Rate Limiting (Future)

| Endpoint | Limit |
|----------|-------|
| Login | 5 attempts / 15 min |
| Registration | 3 / hour per IP |
| API (public) | 100 / min per key |

---

## 8. File Upload Security

### 8.1 Attachment Rules

| Rule | Implementation |
|------|----------------|
| File type whitelist | PDF, JPG, PNG, XLSX, CSV only |
| Max file size | 10 MB per file |
| Virus scan | Future (ClamAV or cloud service) |
| Storage path | `{office_id}/{entity_type}/{entity_id}/{filename}` |
| Access control | RLS on storage bucket |
| No executable files | Block .exe, .js, .html uploads |

### 8.2 Document Visibility

- Attachments inherit access from parent entity
- Client can only see attachments on their own invoices/receipts
- Partner can only see attachments on shared deals

---

## 9. Audit & Risk Principles

### 9.1 What Gets Logged

- All financial mutations (create, edit, void, approve)
- All rule changes (cut, fee, rate, approval)
- Login events (configurable)
- Permission changes
- Verification status changes
- Partnership changes

### 9.2 Audit Log Protection

- Append-only table
- No application code path to modify audit logs
- Super Admin can view but not edit
- Retained minimum 7 years

### 9.3 Risk Monitoring (FlashAudit Center — P2)

| Alert | Trigger |
|-------|---------|
| Large transaction | Amount > threshold |
| Edited approved transaction | Edit after approval |
| Missing attachment | Transaction > 24h without attachment |
| Losing transaction | Negative profit |
| Rate far from market | Override > X% from reference |
| Multiple voids by same user | > 3 voids in 24h |
| Unverified service used | Service status = unverified |

---

## 10. Client Access Limits

### 10.1 What Clients Can Access

```
✅ Own profile
✅ Own quote requests and status
✅ Own invoices and receipts
✅ Own uploaded documents
✅ Public office directory
✅ Public office profiles
✅ Public service listings (with verification badges)
```

### 10.2 What Clients Cannot Access

```
❌ Any office internal data
❌ Office profit/loss
❌ Other clients
❌ Transaction details (except own receipts)
❌ Staff information
❌ Partner settlements
❌ Audit logs
❌ Unpublished services
❌ Internal office notes
```

---

## 11. Partner Access Limits

### 11.1 Shared Data (Active Partnership)

```
✅ Partner office public profile
✅ Agreed partnership terms
✅ Shared deal tickets (future)
✅ Shared settlement records (future)
✅ Documents attached to shared deals
```

### 11.2 Isolated Data

```
❌ Partner's full client list
❌ Partner's full transaction history
❌ Partner's profit/loss
❌ Partner's internal accounts
❌ Partner's staff
❌ Partner's audit logs
```

---

## 12. Verification & Trust Security

### 12.1 Verification Integrity

| Rule | Enforcement |
|------|-------------|
| Unverified never shown as verified | UI badge + API response |
| Suspended offices hidden | Directory filter + RLS |
| Service verification independent | Separate status field |
| Admin controls verification | Super Admin only |
| Verification changes audited | Audit log entry |

### 12.2 Marketplace Trust

- No fake verification badges
- No algorithmic trust score in MVP (manual only)
- Platform can remove listings for policy violations

---

## 13. AI Security Constraints

### 13.1 AI Role Permissions

```
✅ Read aggregated data (for analysis)
✅ Generate suggestions
✅ Summarize reports
✅ Detect anomalies (flag for human review)
✅ Extract receipt data (propose, not post)

❌ Create transactions
❌ Edit transactions
❌ Approve transactions
❌ Void transactions
❌ Modify rules
❌ Change balances
❌ Delete any record
```

### 13.2 AI Action Flow

```
AI suggests → Human reviews → Human approves → System executes

Never: AI suggests → System executes
```

---

## 14. Compliance Considerations

### 14.1 Data Protection

- Office data belongs to the office (tenant)
- Platform processes data as processor
- Client data shared only with offices they interact with
- Data export capability (future)
- Account deletion request handling (future — soft delete, retain financial records)

### 14.2 Financial Regulations

- Platform does not replace licensed money transfer compliance
- Offices responsible for their own licensing
- Platform provides tools for record-keeping and audit
- Integration with licensed providers respects their terms

---

## 15. Security Checklist (Pre-Release)

- [ ] RLS enabled on all tenant tables
- [ ] RLS policies tested with multiple offices
- [ ] Permission checks in all service methods
- [ ] No service role key in client code
- [ ] No DELETE on financial tables
- [ ] Audit logs append-only
- [ ] Client cannot access office internal data
- [ ] Partner cannot access non-shared office data
- [ ] File upload type and size restricted
- [ ] HTTPS enforced
- [ ] Environment variables properly separated
- [ ] Super Admin cannot edit financial records
- [ ] AI has no write permissions

---

*Security in a multi-tenant financial platform is not a feature — it is the foundation.*
