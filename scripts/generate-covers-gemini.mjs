// Generates full-bleed AI cover art for every book and journal via the
// Gemini 2.5 Flash Image ("Nano Banana") model, then composites crisp
// title/subtitle typography on top with node-canvas. Replaces the earlier
// generate-covers.mjs, which only drew flat vector color-blocks (title text
// sat inside a solid-color panel covering ~60% of the frame, so the "cover"
// never actually filled its container visually). This version asks Gemini
// for genuine full-bleed artwork -- no dead flat space -- and only overlays
// text inside a bottom gradient scrim, so the generated image reads through
// across the whole 800x1200 frame.
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createCanvas, loadImage } from "canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
config({ path: path.join(projectRoot, ".env.local") });

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("GOOGLE_API_KEY not set in .env.local");
  process.exit(1);
}

const coversDir = path.join(projectRoot, "public", "covers");
const MODEL = "gemini-2.5-flash-image";
const WIDTH = 800;
const HEIGHT = 1200;

// Brand palette (app/globals.css), passed into every prompt so the AI art
// stays in the same family as the rest of the site rather than drifting.
const BRAND = "ink near-black #1a202c, warm porcelain white #fefdfb, sage green #8b9a8e, slate gray #4a5568";

const STYLE =
  "Gallery-quality academic-publishing cover art. Abstract editorial illustration, " +
  "confident geometric composition, painterly gradients, subtle grain texture, " +
  "muted sophisticated palette, full-bleed edge-to-edge (no borders, no vignette, " +
  "no white margins), portrait orientation. absolutely no text, no letters, no numbers, " +
  "no watermark, no logo.";

const items = {
  books: {
    "kiln-and-empire": {
      title: "Kiln and Empire",
      subtitle: "Ceramic Trade Networks\n1400–1800",
      colors: ["#8B7355", "#D4AF37", "#FFF8DC"],
      theme:
        "celadon and blue-and-white porcelain vessels, kiln fire glow, trade ships on open water, Goryeo-to-Ming maritime trade routes",
    },
    "tone-and-territory": {
      title: "Tone and Territory",
      subtitle: "Language Contact in the\nYellow Sea Basin",
      colors: ["#2C3E50", "#34495E", "#ECF0F1"],
      theme:
        "coastal fishing communities, overlapping tidal waves as a metaphor for language contact, misty Yellow Sea horizon, deep blue-slate tones",
    },
    "memory-across-cultures": {
      title: "Memory Across Cultures",
      subtitle: "Narrative Tradition and the\nAutobiographical Mind",
      colors: ["#9B59B6", "#8E44AD", "#F5E6D3"],
      theme:
        "layered concentric memory rings, soft violet neural-like forms, dreamlike overlapping portrait silhouettes, warm cream ground",
    },
    "tideline-governance": {
      title: "Tideline Governance",
      subtitle: "Rights, Reefs, and\nRegulation",
      colors: ["#16A085", "#1ABC9C", "#ECF0F1"],
      theme:
        "coral reef structures dissolving into surveyed grid lines, teal tidewater, aerial coastline abstraction",
    },
    "the-credential-economy": {
      title: "The Credential Economy",
      subtitle: "Access and Inflation in\nHigher Education",
      colors: ["#C0504D", "#4472C4", "#F5E6D3"],
      theme:
        "ascending staircase of diploma-like geometric panels, rising bar-chart forms, brick red and cobalt blue academic palette",
    },
    "archival-korea": {
      title: "Archival Korea",
      subtitle: "Diplomatic Method in the\nTwentieth Century",
      colors: ["#1C1C1C", "#4A4A4A", "#D4AF37"],
      theme:
        "stacked archival document folders and ledger seals, gold diplomatic wax-seal accents, charcoal black formal composition",
    },
  },
  journals: {
    "quarterly-comparative-linguistics": {
      title: "Quarterly Journal of",
      subtitle: "Comparative Linguistics",
      colors: ["#2C5282", "#2D3748", "#E8F4F8"],
      theme:
        "abstract sound-wave and syntax-tree line forms interlacing, deep academic blue, ice-pale background",
    },
    "annals-of-ceramic-materials": {
      title: "Annals of",
      subtitle: "Ceramic Materials Science",
      colors: ["#744210", "#A0522D", "#FFF8DC"],
      theme:
        "cross-section of glazed ceramic material under magnification, kiln-fired amber and umber tones, crystalline glaze texture",
    },
    "journal-of-applied-cognitive-science": {
      title: "Journal of",
      subtitle: "Applied Cognitive Science",
      colors: ["#553399", "#6B46C1", "#F3E8FF"],
      theme:
        "abstract branching neural pathways, soft violet gradient bloom, minimal cognitive-science motif",
    },
    "coastal-and-environmental-policy-review": {
      title: "Coastal and Environmental",
      subtitle: "Policy Review",
      colors: ["#0B5345", "#1B7355", "#E8F5E9"],
      theme:
        "aerial view of mangrove coastline meeting regulatory grid lines, deep emerald and sea green",
    },
    "journal-of-regional-development-economics": {
      title: "Journal of Regional",
      subtitle: "Development Economics",
      colors: ["#1F4788", "#2E5090", "#E3F2FD"],
      theme:
        "abstract trade-corridor map lines converging, rising economic bar forms, cobalt blue on pale sky",
    },
    "journal-of-education-and-social-mobility": {
      title: "Journal of Education",
      subtitle: "and Social Mobility",
      colors: ["#D84315", "#E64A19", "#FFF3E0"],
      theme:
        "ascending staircase silhouettes of students, warm terracotta and amber gradient, hopeful upward composition",
    },
  },
};

async function generateArt(theme, colors) {
  const prompt =
    `${STYLE} Subject: ${theme}. ` +
    `Primary palette for this piece: ${colors.join(", ")}, kept within the site's overall brand family (${BRAND}). ` +
    `Aspect ratio 2:3 portrait, ${WIDTH}x${HEIGHT}.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(`No image data in response: ${JSON.stringify(data).slice(0, 500)}`);
  }
  return Buffer.from(imagePart.inlineData.data, "base64");
}

function wrapTitle(title) {
  return title.split("\n");
}

async function compositeCover(artBuffer, design, filename) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  const art = await loadImage(artBuffer);
  // cover-fit the art into the canvas, then overscan by 12% -- despite the
  // "full bleed, no borders" prompt instruction, the model reliably leaves a
  // faint margin/vignette near the edges, so we zoom in and crop it away.
  const scale = Math.max(WIDTH / art.width, HEIGHT / art.height) * 1.12;
  const drawW = art.width * scale;
  const drawH = art.height * scale;
  ctx.drawImage(art, (WIDTH - drawW) / 2, (HEIGHT - drawH) / 2, drawW, drawH);

  // Bottom gradient scrim for text legibility -- covers roughly the lower
  // 42% of the frame, leaving the rest of the artwork untouched.
  const scrimTop = HEIGHT * 0.58;
  const grad = ctx.createLinearGradient(0, scrimTop, 0, HEIGHT);
  grad.addColorStop(0, "rgba(15, 15, 15, 0)");
  grad.addColorStop(0.35, "rgba(15, 15, 15, 0.55)");
  grad.addColorStop(1, "rgba(15, 15, 15, 0.88)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, scrimTop, WIDTH, HEIGHT - scrimTop);

  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = 'bold 54px Georgia, "Times New Roman", serif';
  const titleLines = wrapTitle(design.title);
  const marginX = 56;
  let cursorY = HEIGHT - (HEIGHT - scrimTop) * 0.52 + 10;
  titleLines.forEach((line) => {
    ctx.fillText(line, marginX, cursorY);
    cursorY += 60;
  });

  // Subtitle
  ctx.font = '400 26px Georgia, "Times New Roman", serif';
  ctx.globalAlpha = 0.85;
  cursorY += 6;
  design.subtitle.split("\n").forEach((line) => {
    ctx.fillText(line, marginX, cursorY);
    cursorY += 34;
  });
  ctx.globalAlpha = 1;

  const buffer = canvas.toBuffer("image/png");
  await fs.writeFile(path.join(coversDir, filename), buffer);
  console.log(`✓ Saved ${filename}`);
}

async function generateOne(slug, design, filename) {
  console.log(`Generating art for ${filename}...`);
  const artBuffer = await generateArt(design.theme, design.colors);
  await compositeCover(artBuffer, design, filename);
}

async function main() {
  await fs.mkdir(coversDir, { recursive: true });

  const only = process.argv[2];

  for (const [slug, design] of Object.entries(items.books)) {
    const filename = `book-${slug}.png`;
    if (only && !filename.includes(only)) continue;
    await generateOne(slug, design, filename);
  }

  for (const [slug, design] of Object.entries(items.journals)) {
    const filename = `journal-${slug}.png`;
    if (only && !filename.includes(only)) continue;
    await generateOne(slug, design, filename);
  }

  console.log("\n✓ All covers generated!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
