# esbuild-plugin-json-cleanup

[![NPM Version](https://img.shields.io/npm/v/esbuild-plugin-json-cleaner)](https://www.npmjs.com/package/esbuild-plugin-json-cleaner)
[![JSR](https://jsr.io/badges/@afcms/esbuild-plugin-json-cleaner)](https://jsr.io/@afcms/esbuild-plugin-json-cleaner)

An esbuild plugin to cleanup JSON files by changing the indentation and removing some top level tags.

```typescript
import esbuild from "esbuild";
import JSONCleanerPlugin from "esbuild-plugin-json-cleaner";

esbuild.build({
    outdir: "dist",
    plugins: [
        JSONCleanerPlugin({
            src: "src/data.json",
            out: "data.json",
            removeSchema: true,
            removeTags: ["tag1", "tag2"],
            minify: false,
            space: 2
        })
    ]
});
```
