export default function SectionLayout({ children }) {
  return (
    <section className="container m-auto p-5">
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
