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
      <main className="pt-32 pb-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center">
        <section className="max-w-3xl w-full glass p-8 rounded-xl text-white animate-fade-in">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <p className="text-lg text-gray-200 mb-8">Coming soon: articles, tutorials, and thoughts on web development, design, and AI.</p>
        </section>
      </main>
    </>
  );
}
