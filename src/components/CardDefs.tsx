import { useEffect, useState } from "react";

const CARD_IDS = [
  // Clubs
  "AC",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "10C",
  "JC",
  "QC",
  "KC",
  // Diamonds
  "AD",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "10D",
  "JD",
  "QD",
  "KD",
  // Hearts
  "AH",
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "10H",
  "JH",
  "QH",
  "KH",
  // Spades
  "AS",
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "10S",
  "JS",
  "QS",
  "KS",
  // Special cards
  "X",
  "O1",
  "O2",
];

export const CardDefs = () => {
  const [svgContents, setSvgContents] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    const loadAllSvgs = async () => {
      const contents = new Map<string, string>();

      await Promise.all(
        CARD_IDS.map(async (id) => {
          try {
            const response = await fetch(`/svg/${id}.svg`);
            const text = await response.text();

            // Parse the SVG and extract just the content (not the outer <svg> wrapper)
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "image/svg+xml");
            const svgElement = doc.querySelector("svg");

            if (svgElement) {
              // Get viewBox or calculate from width/height
              const viewBox =
                svgElement.getAttribute("viewBox") ||
                `0 0 ${svgElement.getAttribute("width") || "238"} ${svgElement.getAttribute("height") || "332"}`;

              // Store both viewBox and inner content
              contents.set(
                id,
                JSON.stringify({
                  viewBox,
                  content: svgElement.innerHTML,
                })
              );
            }
          } catch (error) {
            console.error(`Failed to load SVG for ${id}:`, error);
          }
        })
      );

      setSvgContents(contents);
    };

    loadAllSvgs();
  }, []);

  // Don't render until all SVGs are loaded
  if (svgContents.size === 0) {
    return null;
  }

  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        {CARD_IDS.map((id) => {
          const data = svgContents.get(id);
          if (!data) return null;

          const { viewBox, content } = JSON.parse(data);

          return (
            <symbol
              key={id}
              id={`card-${id}`}
              viewBox={viewBox}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        })}
      </defs>
    </svg>
  );
};
