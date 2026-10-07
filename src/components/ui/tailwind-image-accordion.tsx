const items = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=960&h=720&q=80',
    title: 'Filip Pabisiak',
    description: 'CTO & Main Programmist',
    tags: ['Floral', 'Highlands', 'Wildflowers', 'Colorful', 'Resilience'],
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=960&h=720&q=80',
    title: 'Piotr Smółka',
    description: 'CEO & Founder',
    tags: ['Twilight', 'Peaks', 'Silhouette', 'Evening Sky', 'Peaceful'],
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=960&h=720&q=80',
    title: 'Borys Porydzaj',
    description: 'COO & Co-Founder',
    tags: ['Rocky', 'Ridges', 'Contrast', 'Adventure', 'Clouds'],
  },
]

export default function TailwindImageAccordion() {
  return (
    <div className="about-people group mx-auto mb-10 mt-3 flex w-[80%] justify-center gap-2 max-md:flex-col">
      {items.map((item) => (
        <article
          key={item.id}
          className="group/article relative w-full overflow-hidden rounded-xl transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-linear-to-t before:from-black/50 before:transition-opacity md:not-[&:hover]:group-hover:w-[20%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:absolute after:inset-0 after:rounded-lg after:bg-white/30 after:opacity-0 after:backdrop-blur-sm after:transition-all md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 focus-within:ring-3 focus-within:ring-indigo-300"
        >
          <a
            className="absolute inset-0 z-10 flex flex-col justify-end p-3 text-white"
            href="#o-nas"
          >
            <h3 className="text-xl font-medium transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] md:translate-y-2 md:truncate md:whitespace-nowrap md:opacity-0 group-hover/article:translate-y-0 group-hover/article:opacity-100 group-hover/article:delay-300 group-focus-within/article:translate-y-0 group-focus-within/article:opacity-100 group-focus-within/article:delay-300">
              {item.title}
            </h3>
            <span className="text-3xl font-medium transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] md:translate-y-2 md:truncate md:whitespace-nowrap md:opacity-0 group-hover/article:translate-y-0 group-hover/article:opacity-100 group-hover/article:delay-500 group-focus-within/article:translate-y-0 group-focus-within/article:opacity-100 group-focus-within/article:delay-500">
              {item.description}
            </span>
          </a>
          <img
            className="h-64 w-full object-cover md:h-[360px]"
            src={item.url}
            width={960}
            height={480}
            alt={item.title}
          />
        </article>
      ))}
    </div>
  )
}
