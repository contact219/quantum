import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    "local",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email.toLowerCase().trim());
        if (!user || !user.password) {
          return done(null, false, { message: "Invalid email or password." });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return done(null, false, { message: "Invalid email or password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // GET /api/login — serve the portal login / register form
  app.get("/api/login", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(loginPage());
  });

  // POST /api/login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ ok: false, message: info?.message ?? "Login failed." });
      }
      const sessionUser = { claims: { sub: user.id }, ...user };
      req.login(sessionUser, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ ok: true });
      });
    })(req, res, next);
  });

  // POST /api/register
  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ ok: false, message: "Email and password are required." });
      }
      if (password.length < 8) {
        return res.status(400).json({ ok: false, message: "Password must be at least 8 characters." });
      }
      const existing = await storage.getUserByEmail(email.toLowerCase().trim());
      if (existing) {
        return res.status(409).json({ ok: false, message: "An account with that email already exists." });
      }
      const hashed = await bcrypt.hash(password, 12);
      const user = await storage.createUser({
        email: email.toLowerCase().trim(),
        password: hashed,
        firstName: firstName || null,
        lastName: lastName || null,
      });
      const sessionUser = { claims: { sub: user.id }, ...user };
      req.login(sessionUser, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ ok: true });
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/logout
  app.get("/api/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
  });
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  const userId = req.user?.claims?.sub ?? req.user?.id;
  if (!req.isAuthenticated() || !userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};

export const isAdmin: RequestHandler = async (req: any, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user?.claims?.sub ?? req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const user = await storage.getUser(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    return next();
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

function loginPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Quantum Surety — Portal Login</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0f1a;color:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .card{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 25px 50px rgba(0,0,0,.5)}
    .logo{text-align:center;margin-bottom:2rem}
    .logo h1{font-size:1.5rem;font-weight:700;color:#60a5fa;letter-spacing:.05em}
    .logo p{font-size:.8rem;color:#6b7280;margin-top:.25rem}
    h2{font-size:1.1rem;font-weight:600;margin-bottom:1.5rem;color:#f9fafb}
    .form-group{margin-bottom:1rem}
    label{display:block;font-size:.8rem;font-weight:500;color:#9ca3af;margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.05em}
    input{width:100%;padding:.65rem .9rem;background:#1f2937;border:1px solid #374151;border-radius:6px;color:#f9fafb;font-size:.95rem;outline:none;transition:border-color .15s}
    input:focus{border-color:#3b82f6}
    .name-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .btn{width:100%;padding:.75rem;background:#2563eb;color:#fff;border:none;border-radius:6px;font-size:.95rem;font-weight:600;cursor:pointer;margin-top:.5rem;transition:background .15s}
    .btn:hover{background:#1d4ed8}
    .btn:disabled{background:#374151;cursor:not-allowed}
    .toggle{text-align:center;margin-top:1.25rem;font-size:.85rem;color:#6b7280}
    .toggle a{color:#60a5fa;cursor:pointer;text-decoration:none;font-weight:500}
    .toggle a:hover{text-decoration:underline}
    .error{background:#450a0a;border:1px solid #991b1b;color:#fca5a5;border-radius:6px;padding:.65rem .9rem;font-size:.85rem;margin-bottom:1rem;display:none}
    .back{display:block;text-align:center;margin-top:1.5rem;font-size:.8rem;color:#4b5563;text-decoration:none}
    .back:hover{color:#9ca3af}
  </style>
</head>
<body>
<div class="card">
  <div class="logo"><h1>Quantum Surety</h1><p>Client Portal</p></div>
  <div id="err" class="error"></div>
  <div id="lv">
    <h2>Sign In</h2>
    <form id="lf">
      <div class="form-group"><label>Email</label><input type="email" name="email" required autocomplete="email"/></div>
      <div class="form-group"><label>Password</label><input type="password" name="password" required autocomplete="current-password"/></div>
      <button class="btn" type="submit">Sign In</button>
    </form>
    <div class="toggle">No account? <a onclick="show('rv','lv')">Create one</a></div>
  </div>
  <div id="rv" style="display:none">
    <h2>Create Account</h2>
    <form id="rf">
      <div class="name-row">
        <div class="form-group"><label>First Name</label><input type="text" name="firstName" autocomplete="given-name"/></div>
        <div class="form-group"><label>Last Name</label><input type="text" name="lastName" autocomplete="family-name"/></div>
      </div>
      <div class="form-group"><label>Email</label><input type="email" name="email" required autocomplete="email"/></div>
      <div class="form-group"><label>Password</label><input type="password" name="password" required autocomplete="new-password" minlength="8"/></div>
      <button class="btn" type="submit">Create Account</button>
    </form>
    <div class="toggle">Have an account? <a onclick="show('lv','rv')">Sign in</a></div>
  </div>
  <a href="/" class="back">← Back to Quantum Surety</a>
</div>
<script>
const e=document.getElementById('err');
function show(a,b){e.style.display='none';document.getElementById(a).style.display='block';document.getElementById(b).style.display='none'}
async function post(url,data){return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})}
document.getElementById('lf').addEventListener('submit',async ev=>{
  ev.preventDefault();e.style.display='none';
  const b=ev.target.querySelector('button');b.disabled=true;b.textContent='Signing in…';
  const f=new FormData(ev.target);
  const r=await post('/api/login',{email:f.get('email'),password:f.get('password')});
  if(r.ok){location.href='/portal'}else{const d=await r.json().catch(()=>({}));e.textContent=d.message||'Login failed.';e.style.display='block';b.disabled=false;b.textContent='Sign In'}
});
document.getElementById('rf').addEventListener('submit',async ev=>{
  ev.preventDefault();e.style.display='none';
  const b=ev.target.querySelector('button');b.disabled=true;b.textContent='Creating account…';
  const f=new FormData(ev.target);
  const r=await post('/api/register',{email:f.get('email'),password:f.get('password'),firstName:f.get('firstName'),lastName:f.get('lastName')});
  if(r.ok){location.href='/portal'}else{const d=await r.json().catch(()=>({}));e.textContent=d.message||'Registration failed.';e.style.display='block';b.disabled=false;b.textContent='Create Account'}
});
</script>
</body>
</html>`;
}
