export const mappings = {
    './src/emitWarning_deno.ts': './src/emitWarning_node.ts',
};
export const shims = {
    blob: true,
    crypto: true,
    deno: true,
    fetch: true,
};
export const compilerOptions = {};
export const packageData = {
    name: "@pianocms/container",
    version: "0.0.1",
    description: "A dependency injection container for Piano",
    keywords: ["dependency injection", "container", "injection", "cms", "piano", "pianocms"],
    license: "MIT",
    engines: {
        node: ">=16.5.0 <18",
    },
    repository: {
        type: "git",
        url: "git+https://github.com/pianocms/container.git",
    },
    dependencies: {
        "@types/node": "^16",
    }
};