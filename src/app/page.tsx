import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <Image
          src="/logo.png"
          alt="WordleGPT logo"
          width={250}
          height={250}
          priority
        />
        <p className="text-center sm:text-left max-w-prose">
          WordleGPT is a snarky Wordle companion that offers hints, strategies,
          and valid guesses. It might tease you.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/legal"
            rel="noopener noreferrer"
          >
            Legal
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open API Spec
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <span className="flex items-center gap-2 hover:underline hover:underline-offset-4">
          Created by Zach Boone, 2025
        </span>
      </footer>
    </div>
  );
}
