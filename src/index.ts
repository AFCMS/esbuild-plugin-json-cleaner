import esbuild from "esbuild";

import fs from "node:fs";
import path from "node:path";

/**
 * Ensure that the directory exists.
 * @param {string} dir - The directory to check.
 */
function makeSureDirectoryExists(dir: string) {
    try {
        fs.accessSync(dir);
    } catch {
        fs.mkdirSync(dir, { recursive: true });
    }
}

type JSONCleanerPluginParams = {
    /**
     * Source JSON file
     */
    src: string;
    /**
     * Output JSON file, relative to the out dir
     */
    out: string;
    /**
     * Remove the top `$schema` field from the JSON, default false
     *
     * It is often not used by the final application and can be removed
     */
    removeSchema?: boolean;
    /**
     * Remove the specified top tags from the JSON
     */
    removeTags?: string[]
    /**
     * Minify the JSON by using an indent size of 0
     */
    minify?: boolean;
    /**
     * Change the indentation of the JSON, default to `\t`
     *
     * Incompatible with `minify`
     */
    space?: string | number;
}

// noinspection JSUnusedGlobalSymbols
/**
 * A plugin to clean up JSON files
 *
 * ```typescript
 * import esbuild from "esbuild";
 * import JSONCleanerPlugin from "esbuild-plugin-json-cleaner";
 *
 * esbuild.build({
 *    outdir: "dist",
 *    plugins: [
 *      JSONCleanerPlugin({
 *          src: "src/data.json",
 *          out: "data.json",
 *          removeSchema: true,
 *          removeTags: ["tag1", "tag2"],
 *          minify: false,
 *          space: 2
 *      })
 *    ]
 * });
 * ```
 * @param params
 * @constructor
 */
export default function JSONCleanerPlugin(params: JSONCleanerPluginParams): esbuild.Plugin {
    return {
        name: "json-edit",
        setup(build: esbuild.PluginBuild) {
            build.onEnd(() => {
                const json = JSON.parse(fs.readFileSync(params.src).toString())

                if (params.removeSchema) {
                    delete json.$schema;
                }

                if (params.removeTags) {
                    for (const tag of params.removeTags) {
                        delete json[tag];
                    }
                }

                const indent = params.minify ? 0 : (params.space ?? '\t');

                const fullOut = path.join(build.initialOptions.outdir, params.out);

                makeSureDirectoryExists(path.dirname(fullOut));

                fs.writeFileSync(fullOut, JSON.stringify(json, null, indent));
            })
        }
    } satisfies esbuild.Plugin
};
