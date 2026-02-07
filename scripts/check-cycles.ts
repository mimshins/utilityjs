import madge from "madge";
import { join, resolve } from "node:path";
import { cwd } from "node:process";

const rootDir = resolve(import.meta.dirname, "..");

const instance = await madge(cwd(), {
  fileExtensions: ["ts", "tsx"],
  tsConfig: join(rootDir, "tsconfig.json"),
  detectiveOptions: {
    es6: {
      skipTypeImports: true,
    },
    ts: {
      skipTypeImports: true,
    },
  },
});

const cycles = instance.circular();

if (cycles.length === 0) process.exit(0);
else {
  console.log(
    `\x1b[31m Found ${cycles.length} circular dependencies! \x1b[0m\n`,
  );

  const cycleModules: string[] = [];

  cycles.forEach((cycle, idx) => {
    cycleModules.push(`${idx + 1}) ${cycle.join(" > ")}`);
  });

  console.log(cycleModules.join("\n") + "\n");

  process.exit(1);
}
