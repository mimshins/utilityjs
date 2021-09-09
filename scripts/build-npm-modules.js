const path = require("path");
const fse = require("fs-extra");
const glob = require("fast-glob");

const packagePath = process.cwd();

const buildPath = path.join(packagePath, "dist");
const srcPath = path.join(packagePath, "src");

const esmPath = path.join(buildPath, "esm");
const cjsPath = path.join(buildPath, "cjs");
const npmPath = path.join(buildPath, "npm");

const modulePaths = glob.sync(path.join(srcPath, "*"), {
  onlyDirectories: true
});

const moduleNames = modulePaths.map(path => path.replace(`${srcPath}/`, ""));

const ensureOutDirs = async () => {
  await fse.ensureDir(npmPath);
  await Promise.all(
    moduleNames.map(name => fse.ensureDir(path.join(npmPath, name)))
  );
};

const createModules = async () => {
  await Promise.all(
    moduleNames.map(async name => {
      await fse.copyFile(
        path.join(`${cjsPath}/${name}`, `${name}.js`),
        path.join(npmPath, name, `${name}.js`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${name}`, `index.js`),
        path.join(npmPath, name, `index.js`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${name}`, `${name}.d.ts`),
        path.join(npmPath, name, `${name}.d.ts`)
      );
      await fse.copyFile(
        path.join(`${cjsPath}/${name}`, `index.d.ts`),
        path.join(npmPath, name, `index.d.ts`)
      );
      await fse.ensureDir(`${npmPath}/${name}/esm`);
      await fse.copyFile(
        path.join(`${esmPath}/${name}`, `${name}.js`),
        path.join(npmPath, name, "esm", `${name}.js`)
      );
      await fse.copyFile(
        path.join(`${esmPath}/${name}`, `index.js`),
        path.join(npmPath, name, "esm", `index.js`)
      );
    })
  );
};

const copyFromModules = async fileName => {
  await Promise.all(
    modulePaths.map((p, i) =>
      fse.copyFile(
        path.join(p, fileName),
        path.join(npmPath, moduleNames[i], fileName)
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
