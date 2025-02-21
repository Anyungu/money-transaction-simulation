import fs from "fs";
import path from "path";


const getJsFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getJsFiles(fullPath));
    } else if (file.endsWith(".js")) {
      results.push(fullPath);
    }
  }
  return results;
};


const fixImports = () => {
  const distDir = "dist";
  if (!fs.existsSync(distDir)) return;

  const files = getJsFiles(distDir);

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");

    content = content.replace(/from\s+["'](.*?\.ts)["']/g, (_, match) => `from "${match.replace(".ts", ".js")}"`);

    fs.writeFileSync(file, content);
  });

  console.log("✅ Fixed import extensions in compiled files.");
};


fixImports();
