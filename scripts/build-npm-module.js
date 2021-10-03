const path = require("path");
const fse = require("fs-extra");

const moduleType = process.argv[2];

const args = process.argv.slice(3);

const packagePath = process.cwd();

const buildPath = path.join(packagePath, "dist");
const srcPath = path.join(packagePath, "src");

const esmPath = path.join(buildPath, "esm");
const cjsPath = path.join(buildPath, "cjs");
const npmPath = path.join(buildPath, "npm");

const modules = args
  .map(arg => path.join(srcPath, moduleType, arg))
  .filter(path => fse.existsSync(path))
  .map(path => [path, path.replace(`${srcPath}/${moduleType}/`, "")]);

const ensureOutDirs = async () => {
  await fse.ensureDir(npmPath);
  await Promise.all(
    modules.map(module => fse.ensureDir(path.join(npmPath, module[1])))
  );
};

const createModules = async () => {
  await Promise.all(
    modules.map(async module => {
      await fse.copyFile(
        path.join(`${cjsPath}/${module[1]}`, `${module[1]}.js`),
        path.join(npmPath, module[1], `${module[1]}.js`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${module[1]}`, `index.js`),
        path.join(npmPath, module[1], `index.js`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${module[1]}`, `${module[1]}.d.ts`),
        path.join(npmPath, module[1], `${module[1]}.d.ts`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${module[1]}`, `index.d.ts`),
        path.join(npmPath, module[1], `index.d.ts`)
      );
      await fse.ensureDir(`${npmPath}/${module[1]}/esm`);
      await fse.copyFile(
        path.join(`${esmPath}/${module[1]}`, `${module[1]}.js`),
        path.join(npmPath, module[1], "esm", `${module[1]}.js`)
      );
      await fse.copyFile(
        path.join(`${esmPath}/${module[1]}`, `index.js`),
        path.join(npmPath, module[1], "esm", `index.js`)
      );
    })
  );
};

const copyFromModules = async fileName => {
  await Promise.all(
    modules.map(module =>
      fse.copyFile(
        path.join(module[0], fileName),
        path.join(npmPath, module[1], fileName)
      )
    )
  );
};

const copyPackageJson = async () => {
  await copyFromModules("package.json");
};

const copyREADME = async () => {
  await copyFromModules("README.md");
};

(async () => {
  try {
    await ensureOutDirs();
    await createModules();
    await copyREADME();
    await copyPackageJson();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();
