"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Mengecek apakah URL berakhiran /register
  const isRegister = pathname.endsWith("/register");
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1eb] px-5 py-6 font-sans text-[#1c2928] sm:px-10 sm:py-7 lg:px-[5vw]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[.15] [background-image:radial-gradient(#1c2928_.6px,transparent_.6px)] [background-size:9px_9px] [mask-image:linear-gradient(135deg,black,transparent_70%)]"
        aria-hidden="true"
      />
      <Link
        href="/"
        className="relative z-10 inline-flex items-center gap-2.5 text-xl font-bold tracking-[-.04em] text-inherit no-underline"
      >
        <span className="grid size-8 place-items-center rounded-full border border-[#1c2928] font-serif text-base">
          同
        </span>
        <span>Dōki</span>
      </Link>
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-[1180px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(360px,470px)] lg:gap-[11vw]">
        <div className="relative">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[.16em] text-[#a14e3d]">
            同期 · team workspace
          </p>
          <h1 className="m-0 max-w-[650px] font-serif text-[clamp(48px,6.4vw,88px)] font-normal leading-[.98] tracking-[-.07em]">
            {isRegister ? (
              <>
                Bring your team&apos;s work
                <br />
                <em className="not-italic text-[#a14e3d]">into one flow.</em>
              </>
            ) : (
              <>
                Welcome back.
                <br />
                <em className="not-italic text-[#a14e3d]">
                  Let&apos;s make it count.
                </em>
              </>
            )}
          </h1>
          <p className="mt-7 max-w-[380px] text-[15px] leading-[1.8] text-[#647170] max-sm:hidden">
            {isRegister
              ? "Share progress, ideas, and momentum with your team in one calm workspace."
              : "Your team workspace is ready when you are."}
          </p>
          <div
            className="ml-[42%] mt-11 grid size-[106px] -rotate-[11deg] place-items-center rounded-full border border-[#a14e3d] font-serif leading-none text-[#a14e3d] max-sm:hidden"
            aria-hidden="true"
          >
            <span className="-mb-7 text-[13px]">一緒に</span>
            <strong className="text-[28px] font-normal">進む</strong>
            <small className="-mt-6 text-[9px]">move together</small>
          </div>
        </div>
        <div className="relative rounded border border-[#1c2928]/15 bg-white/70 p-7 shadow-[12px_14px_0_rgba(28,41,40,.06)] sm:p-[clamp(30px,4vw,54px)]">
          <div>
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[.16em] text-[#a14e3d]">
              {isRegister ? "WELCOME TO DŌKI" : "WELCOME BACK"}
            </p>
            <h2 className="m-0 font-serif text-4xl font-normal tracking-[-.06em]">
              {isRegister ? "Create an account" : "Sign in"}
            </h2>
            <p className="mb-8 mt-2.5 text-[13px] text-[#647170]">
              {isRegister
                ? "Start your team&apos;s next chapter."
                : "Return to your workspace."}
            </p>
          </div>
          {children}
        </div>
      </section>
      <p className="relative z-10 m-0 flex justify-between text-[11px] text-[#7b8582] max-sm:gap-2.5">
        <span>Small steps, steady progress.</span>
        <span className="text-[#a14e3d]">© Dōki</span>
      </p>
    </main>
  );
}
