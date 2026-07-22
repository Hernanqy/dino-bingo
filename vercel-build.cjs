const fs = require("fs");
const path = require("path");

const root = __dirname;
const output = path.join(root, ".vercel-static");

fs.rmSync(output, {
    recursive: true,
    force: true
});

fs.mkdirSync(output, {
    recursive: true
});

const ignoredFiles = new Set([
    "package.json",
    "package-lock.json",
    "electron-main.cjs",
    "vercel-build.cjs"
]);

const allowedExtensions = new Set([
    ".html",
    ".css",
    ".js",
    ".json",
    ".webmanifest"
]);

const entries = fs.readdirSync(root, {
    withFileTypes: true
});

entries.forEach(function (entry) {
    if (!entry.isFile()) {
        return;
    }

    if (ignoredFiles.has(entry.name)) {
        return;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (!allowedExtensions.has(extension)) {
        return;
    }

    fs.copyFileSync(
        path.join(root, entry.name),
        path.join(output, entry.name)
    );

    console.log("Copiado:", entry.name);
});

const publicSource = path.join(root, "public");
const publicDestination = path.join(output, "public");

if (!fs.existsSync(publicSource)) {
    throw new Error("No se encontró la carpeta public");
}

fs.cpSync(
    publicSource,
    publicDestination,
    {
        recursive: true
    }
);

const indexPath = path.join(output, "index.html");

if (!fs.existsSync(indexPath)) {
    throw new Error(
        "La versión web no contiene index.html"
    );
}

console.log("");
console.log("Versión web preparada correctamente.");
console.log("Salida:", output);