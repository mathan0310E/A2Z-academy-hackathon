/**
 * Serialise a JSON-LD graph for embedding in a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alone is not safe here: content authored in the admin panel
 * (FAQ answers, hackathon copy) can contain `</script>` or `<`, which would
 * break out of the script element. Escaping the HTML-significant characters as
 * JSON `\uXXXX` keeps the data valid JSON while making it inert in HTML.
 */
export function jsonLdHtml(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
