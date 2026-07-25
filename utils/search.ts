/**
 * Normalises user-entered search text so names such as "Kai Young" and
 * "Kai-Young" are treated as equivalent.
 */
export const normalizeSearchText = (value: string | number | null | undefined) =>
  String(value ?? "")
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, "");

export const matchesSearch = (
  query: string,
  values: Array<string | number | null | undefined>,
) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return values.some((value) =>
    normalizeSearchText(value).includes(normalizedQuery),
  );
};
