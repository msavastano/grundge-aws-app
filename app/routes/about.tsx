export default function AboutPage() {
  return (
    <div className="mt-2">
      <section className="flex justify-center">
        <span className="ml-5 font-semibold">
          <span className="ml-5 text-3xl font-serif">ℹ️ A</span>
          <span className="text-xl text-stone-500">bout</span>
        </span>
      </section>
      <section className="flex justify-center">
        <div className="card w-4/5 p-4">
          <h2 className="m-2 text-xl">Dictionary.com defines</h2>
          <h2 className="m-2 text-5xl">speculative fiction</h2>
          <p className="m-1 text-xl">noun</p>

          <div className="rounded-lg border-4 p-4">
            {" "}
            a broad literary genre encompassing any fiction with supernatural,
            fantastical, or futuristic elements
          </div>

          <p className="m-1 text-xl">
            In keeping with that broad term, 'Free Specultive Fiction' promotes
            this content while also meeting certain other criteria
          </p>
          <p className="m-1 text-xl">1. Free to read 🆓</p>
          <p className="m-1 text-xl">2. Pays authors profession rates 💰</p>
          <p className="m-1 text-xl">3. Printed Media 📃</p>
          <p className="m-1 text-xl">
            &bull; Story images generated by AI model,{" "}
            <a
              className="link"
              href="https://www.craiyon.com/"
              target="_blank"
              rel="noreferrer"
            >
              craiyon
            </a>
            , based on text prompts from the story themes
          </p>
        </div>
      </section>
    </div>
  );
}
