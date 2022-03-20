#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net --allow-env --allow-run
// Copyright 2022 Piano authors. All rights reserved. MIT license.

/**
 * This is the build script for building the oak framework into a Node.js
 * compatible npm package.
 *
 * @module
 */

 import { build, emptyDir } from "https://deno.land/x/dnt@0.20.0/mod.ts";
 import { copy } from "https://deno.land/std@0.126.0/fs/copy.ts";
 import { mappings, shims, compilerOptions, packageData } from './config.ts';
 
 async function start() {
   await emptyDir("./dist-node");
 
   await build({
     entryPoints: ["./src/mod.ts"],
     outDir: "./dist-node",
     mappings: {...mappings},
     shims: {...shims},
     test: true,
     compilerOptions: {
       importHelpers: true,
       target: "ES2021",
        ...compilerOptions
     },
     package: {
       devDependencies: {
         "@types/node": "^16",
       },
       ...packageData,
     },
   });
 
   await Deno.copyFile("LICENSE.md", "dist-node/LICENSE.md");
   await Deno.copyFile("README.md", "dist-node/README.md");
   await Deno.copyFile("install.json", "dist-node/install.json");
 }
 
 start();