import path from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

const config = {
  "*.{ts,tsx,mjs,cjs}": [buildEslintCommand, "pnpm format"],
  "*.{json,yaml,yml,css,md}": ["pnpm format"],
  "schema.prisma": ["pnpm db:format"],
};

export default config;
