import Navbar from "../components/Navbar";
import Head from "next/head";

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog | Nicole Wert</title>
        <meta name="description" content="Nicole Wert's blog" />
      </Head>
      <Navbar />
      <main className="pt-32 pb-16 min-h-screen bg-[var(--background)] flex flex-col items-center">
        <section className="max-w-3xl w-full glass p-8 rounded-2xl border border-[var(--foreground)]/5 shadow-2xl dark:shadow-[var(--foreground)]/5 backdrop-blur-lg animate-fade-in">
          <h1 className="text-4xl font-bold mb-6 text-[var(--foreground)]">Blog</h1>
          <p className="text-lg text-[var(--secondary)] mb-8">Coming soon: articles, tutorials, and thoughts on web development, design, and AI.</p>
        </section>
      </main>
    </>
  );
}
