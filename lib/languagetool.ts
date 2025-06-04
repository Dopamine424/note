
export async function checkTextWithAI(
  text: string,
  checkType: "TYPOS" | "PUNCTUATION" = "TYPOS"
): Promise<string> {
  try {
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text: text,
        language: "ru-RU",
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка API LanguageTool");
    }

    const data = await response.json();
    let correctedText = text;

    data.matches.forEach((match: any) => {
      if (match.rule.category.id === checkType) {
        const replacement = match.replacements[0]?.value || match.context.text;
        correctedText =
          correctedText.substring(0, match.offset) +
          replacement +
          correctedText.substring(match.offset + match.length);
      }
    });

    return correctedText;
  } catch (error) {
    console.error("Ошибка проверки текста:", error);
    return text;
  }
}