import Link from "next/link";

export default function LegalTerms() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Legal Terms</h1>
        <section className="text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] max-w-prose">
          <p>
            Welcome to the legal terms page for the WordleGPT plugin. By using
            this plugin, you agree to the following terms and conditions.
          </p>

          <h2 className="text-lg font-semibold mt-4">1. Usage</h2>
          <p>
            The plugin is provided &quot;as-is&quot; and is meant for personal
            use in accordance with applicable laws.
          </p>

          <h2 className="text-lg font-semibold mt-4">2. Liability</h2>
          <p>
            We are not responsible for any damages or losses caused by the use
            of this plugin. Use it at your own risk.
          </p>

          <h2 className="text-lg font-semibold mt-4">3. Privacy</h2>
          <p>
            We do not collect or store any user data. Any information processed
            by this plugin remains on your device.
          </p>

          <h2 className="text-lg font-semibold mt-4">4. Modifications</h2>
          <p>
            We reserve the right to update these terms at any time. Continued
            use of the plugin constitutes acceptance of the modified terms.
          </p>
        </section>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/"
          >
            Back to Home
          </Link>
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
