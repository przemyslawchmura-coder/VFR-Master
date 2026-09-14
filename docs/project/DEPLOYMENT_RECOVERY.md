# Deployment and password-recovery contract

RevLog uses the browser-safe Supabase URL and publishable key in
`js/supabase.js`. These are public client values; a service-role key or other
private credential must never be placed in the repository or browser bundle.
The GitHub Pages production deployment loads `js/deployment-config.js` before
the Supabase client and supplies the exact recovery destination for the
`/VFR-Master/` path.

## Production configuration

Before loading `js/supabase.js`, the production deployment provides this
explicit `window.REVLOG_CONFIG` object:

```html
<script>
  window.REVLOG_CONFIG = {
    environment: "production",
    recoveryRedirectUrl: "https://przemyslawchmura-coder.github.io/VFR-Master/"
  };
</script>
```

The URL must be absolute, use HTTPS, contain no query or fragment, and be the
same callback path registered in the Supabase Auth redirect allow-list. A
missing, malformed or non-HTTPS production value makes a reset request fail
closed; the app does not derive a production destination from the browser.

For local development only, an explicit recovery URL may be omitted. The app
derives the current localhost/127.0.0.1/::1 origin and path. This fallback is
never used for another host.

## Recovery boundary

The URL may contain a recovery-looking `type=recovery` marker, but that marker
does not unlock the reset form. The form is shown only after the Supabase
client emits `PASSWORD_RECOVERY` with a non-empty session user ID. The session
storage marker is bound to that ID, and `updateUser` is refused unless the
current session has the same identity. Errors and ordinary login sessions stay
outside recovery mode.

Password checks happen before any remote update: both values are required, the
password is at least eight characters, and confirmation must match. While an
update is in flight, repeated submissions are ignored and the button is
disabled. Failures keep the user in the recovery form without reporting
success.

## Operator checklist

1. Keep the verified public callback URL in `js/deployment-config.js` before
   `js/supabase.js` loads.
2. Register that exact URL in Supabase Auth redirect allow-list.
3. Confirm the browser bundle contains only the public Supabase client values.
4. Test request, callback, update, failure and ordinary login locally with
   mocked Supabase calls; deterministic repository tests do not contact the
   production project.

Supabase leaked-password protection remains unavailable on the current Free
plan. It is an external plan limitation and is not replaced or imitated by
application code in this wave.
