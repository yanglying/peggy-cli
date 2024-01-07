import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from '@rollup/plugin-json'
export default {
    input: "lib/index.js",
    output: {
      file: "dist/bundle.js",
      format: "esm",
    },
    plugins: [json(),resolve(),commonjs()],
  };
  