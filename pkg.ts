//Piano Package Metadata: used in Builds, and in the Package Manager

export const name = '@pianocms/container';
export const version = '0.0.1';
export const description = 'An IoC container for Deno and Node.js applications, written in Typescript. Forked from @adonisjs/fold.';

export const mappings = {
    './src/emitWarning_deno.ts': './src/emitWarning_node.ts',
};

export const shims = {
    deno: true,
    fetch: true,
};

export const compilerOptions = {};
export const packageData = {
    name: name,
    version: version,
    description: description,
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

export const PianoInstall = {
    "name": "Piano Container",
    "type": "lib",
    "installDir": "./Piano/Core/Container/",
    "types": "./types/"
}