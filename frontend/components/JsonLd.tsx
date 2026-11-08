/**
 * Renders a JSON-LD structured-data block. `generateMetadata` can't emit script
 * tags, so pages render this in their JSX. The `<` escape prevents any chance of
 * breaking out of the script tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
