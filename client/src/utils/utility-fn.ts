export function extractMarkText(html: string): string[] {
  const ans: string[] = []; // Array to store extracted texts

  // Create a DOM parser
  const parser = new DOMParser();

  // Parse the HTML string into a document
  const doc = parser.parseFromString(html, "text/html");

  // Select all <mark> tags with the specified attribute
  const marks: NodeListOf<HTMLElement> = doc.querySelectorAll(
    'mark[data-type="cloze-gap"]'
  );

  // Extract and push the text content of each <mark> tag into the array
  marks.forEach((mark: HTMLElement) => {
    if (mark.textContent?.trim() !== "") {
      ans.push(mark.textContent!);
    }
  });

  return ans;
}

export function replaceMarkWithGap(html: string): string {
  // Create a DOM parser
  const parser = new DOMParser();

  // Parse the HTML string into a document
  const doc = parser.parseFromString(html, "text/html");

  // Replace each <mark> tag with {{gap}}
  doc.querySelectorAll('mark[data-type="cloze-gap"]').forEach((mark) => {
    const gapPlaceholder = "{{gap}}";
    const textNode = document.createTextNode(gapPlaceholder);
    mark.replaceWith(textNode);
  });

  // Remove <p> tags but preserve their inner text
  doc.querySelectorAll("p").forEach((p) => {
    const parent = p.parentNode;
    if (parent) {
      while (p.firstChild) {
        parent.insertBefore(p.firstChild, p);
      }
      parent.removeChild(p);
    }
  });

  // Return the updated HTML as a string
  return doc.body.textContent?.trim() || "";
}
