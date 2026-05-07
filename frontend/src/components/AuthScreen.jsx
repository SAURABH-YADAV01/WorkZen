import React from "react";
import { ArrowRight, CheckCircle2, FolderKanban, ShieldCheck, Sparkles } from "lucide-react";

function AuthScreen({
  authMode,
  authForm,
  loading,
  message,
  onAuthModeChange,
  onAuthFormChange,
  onSubmit
}) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-story">
          <span className="mark"><FolderKanban size={20} /> WorkZen</span>
          <h1>Plan work, assign owners, and keep every project moving.</h1>
          <p>Modern project tracking for teams that need clear priorities, fast updates, and shared visibility.</p>

          <div className="auth-highlights" aria-label="Product highlights">
            <span><CheckCircle2 size={16} /> Live task status</span>
            <span><ShieldCheck size={16} /> Team access control</span>
            <span><Sparkles size={16} /> Clean project dashboard</span>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-heading">
            <span>Welcome</span>
            <h2>{authMode === "login" ? "Sign in to your workspace" : "Create your workspace account"}</h2>
          </div>

          <div className="switcher">
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => onAuthModeChange("login")}>Login</button>
            <button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => onAuthModeChange("signup")}>Signup</button>
          </div>

          {authMode === "signup" && (
            <label>
              Name
              <input value={authForm.name} onChange={event => onAuthFormChange({ ...authForm, name: event.target.value })} />
            </label>
          )}

          <label>
            Email
            <input type="email" value={authForm.email} onChange={event => onAuthFormChange({ ...authForm, email: event.target.value })} />
          </label>

          <label>
            Password
            <input type="password" value={authForm.password} onChange={event => onAuthFormChange({ ...authForm, password: event.target.value })} />
          </label>

          <button className="primary" disabled={loading}>
            {loading ? "Please wait..." : authMode === "login" ? "Login" : "Create account"}
            <ArrowRight size={16} />
          </button>
          {message && <p className="toast inline">{message}</p>}
        </form>
      </section>
    </main>
  );
}

export default AuthScreen;
