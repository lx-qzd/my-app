"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (email && password) {
      router.push("/dashboard");
    }
  }

  return (
    <main className="login-shell">
      <section className="login-intro">
        <div className="brand-mark">N</div>
        <p className="eyebrow">NORTHSTAR WORKSPACE</p>
        <h1>Make room for your best work.</h1>
        <p className="intro-copy">
          One calm place to organize projects, keep momentum, and see what matters next.
        </p>
        <div className="intro-detail">
          <span className="detail-dot" />
          <span>Everything in focus</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <p className="mobile-brand">NORTHSTAR</p>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your workspace</h2>
          <p className="form-intro">Use any email and password to continue.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-label">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button type="submit">Continue to dashboard <span aria-hidden="true">-&gt;</span></button>
          </form>

          <p className="signup-prompt">
            New to Northstar? <a href="#create-account">Create an account</a>
          </p>
        </div>
      </section>
    </main>
  );
}
