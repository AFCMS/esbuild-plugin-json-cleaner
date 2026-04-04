import fs from "node:fs";
import path from "node:path";

import esbuild from "esbuild";

/**
 * An esbuild plugin to cleanup JSON files by changing the indentation and removing some top level tags.
 * @module
 */

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

/**
 * The base parameters for the JSONCleanerPlugin
 */
interface JSONCleanerPluginParamsBase {
  /**
   * Source JSON file
   */
  readonly src: string;
  /**
   * Output JSON file, relative to the out dir
   */
  readonly out: string;
  /**
   * Remove the top `$schema` field from the JSON, default false
   *
   * It is often not used by the final application and can be removed
   */
  readonly removeSchema?: boolean;
  /**
   * Remove the specified top tags from the JSON
   */
  readonly removeTags?: readonly string[];
}

/**
 * Minify the JSON by using an indent size of 0
 */
interface JSONCleanerPluginParamsMinify {
  /**
   * Minify the JSON by using an indent size of 0
   */
  readonly minify: true;
  readonly space?: never;
}

/**
 * Change the indentation of the JSON, default to `\t`
 */
interface JSONCleanerPluginParamsSpace {
  /**
   * Change the indentation of the JSON, default to `\t`
   * Incompatible with `minify`
   */
  readonly space: `\t` | number;
  readonly minify?: false;
}

interface JSONCleanerPluginParamsDefaultIndent {
  readonly minify?: false;
  readonly space?: undefined;
}

/**
 * The parameters for the JSONCleanerPlugin
 */
export type JSONCleanerPluginParams = JSONCleanerPluginParamsBase &
  (
    | JSONCleanerPluginParamsMinify
    | JSONCleanerPluginParamsSpace
    | JSONCleanerPluginParamsDefaultIndent
  );

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
 */
export default function JSONCleanerPlugin(params: JSONCleanerPluginParams): esbuild.Plugin {
  return {
    name: "json-cleaner",
    setup(build: esbuild.PluginBuild) {
      build.onEnd(() => {
        const json = JSON.parse(fs.readFileSync(params.src).toString());

        if (params.removeSchema) {
          delete json.$schema;
        }

        if (params.removeTags) {
          for (const tag of params.removeTags) {
            delete json[tag];
          }
        }

        const indent =
          "minify" in params && params.minify ? 0 : "space" in params ? params.space : "\t";

        const fullOut = path.join(build.initialOptions.outdir ?? ".", params.out);

        makeSureDirectoryExists(path.dirname(fullOut));

        fs.writeFileSync(fullOut, JSON.stringify(json, null, indent));
      });
    },
  } as const satisfies esbuild.Plugin;
}
