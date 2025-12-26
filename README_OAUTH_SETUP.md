# OAuth Setup for Web Frontend

## Quick Configuration

The OAuth client ID is missing. To fix:

### Step 1: Get Client ID

Get the client ID from your OAuth provider (from Rhapsode_INDE setup).

### Step 2: Create .env.local

```bash
cd web
cat > .env.local << 'EOF'
NEXT_PUBLIC_OAUTH_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT=http://localhost:8000/api/v1/auth/oauth/authorize
NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT=http://localhost:8000/api/v1/auth/oauth/token
NEXT_PUBLIC_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_OAUTH_SCOPES=openid profile email
EOF
```

### Step 3: Update Client ID

Edit `web/.env.local` and replace `your-client-id-here` with the actual client ID.

### Step 4: Restart Dev Server

```bash
npm run dev
```

---

## Verify Configuration

After setup, the OAuth URL should have client_id populated:

```
http://localhost:3000/api/v1/auth/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=...
```

---

## Alternative: Use Supabase Auth

If using Supabase Auth directly:

```bash
NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT=https://iayzzndyaqcqpmksaweg.supabase.co/auth/v1/authorize
NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT=https://iayzzndyaqcqpmksaweg.supabase.co/auth/v1/token
NEXT_PUBLIC_OAUTH_CLIENT_ID=iayzzndyaqcqpmksaweg
```

---

See `docs/OAUTH_CLIENT_ID_CONFIGURATION.md` for detailed options.

