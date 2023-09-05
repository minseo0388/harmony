const $ = async (...cmd: string[]) => {
  const proc = new Deno.Command(cmd.join(" "), {
    stdout: "piped",
    stderr: "piped",
  });
  const childProc = proc.spawn();
  const status = await childProc.status;
  return status.code;
};

const API_DOCS_URL =
  "https://raw.githubusercontent.com/discord/discord-api-spec/main/specs/openapi.json";

interface Endpoint {
  title: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  params: string[];
}

const endpoints: Endpoint[] = [];

const jsonDocs = await fetch(API_DOCS_URL).then((e) => e.json());

type ApiParam = {
  name: string;
  in: "query" | "path";
  schema: {
    type: string[];
    format: string;
  };
};

type OpenApiInfo = {
  operationId: string;
  responses: Record<string, { description: string; content: string }>;
  security: Record<string, never>[];
  parameters?: ApiParam[];
};

for (const [path, data] of Object.entries(jsonDocs.paths)) {
  const preParams: ApiParam[] = [];

  Object.entries(data as Record<string, OpenApiInfo | ApiParam[]>).find(
    ([method, info]) => {
      if (method === "parameters") {
        preParams.push(...info as ApiParam[]);
      }
    },
  );

  for (
    const [method, info] of Object.entries(data as Record<string, OpenApiInfo>)
  ) {
    if (method === "parameters") continue;

    const swapped: Record<string, string> = {};

    const splitName = info.operationId.split("_").map((e) =>
      e[0].toUpperCase() + e.slice(1)
    );

    const params = [...preParams, ...(info?.parameters ?? [])].filter((e) =>
      e.in === "path"
    );

    let url = path;

    params.forEach((param) => {
      const oldName = param.name;
      const newName = param.name.split("_").map((e) =>
        e[0].toUpperCase() + e.slice(1)
      ).join("").replace("Id", "ID");

      swapped[oldName] = newName;
    });

    for (const [oldName, newName] of Object.entries(swapped)) {
      url = url.replace(`{${oldName}}`, "${" + newName + "}");
    }

    endpoints.push({
      title: splitName.join(" "),
      name: splitName.join(""),
      method: method.toUpperCase() as Endpoint["method"],
      url: url,
      params: params.map((e) => swapped[e.name]),
    });
  }
}

let types =
  `// NOTE: This file is auto-generated by scripts/endpoint_typegen.ts\n\nimport { snowflake } from "./common.ts";\n\n`;

function getParamType(name: string): string {
  if (name.endsWith("ID")) {
    return "snowflake";
  } else if (
    name.endsWith("Token") || name.endsWith("Emoji") || name.endsWith("Code") ||
    name === "EmojiName"
  ) {
    return "string";
  } else throw new Error(`Unable to infer Param Type: ${name}`);
}

for (const endpoint of endpoints) {
  types += `/**\n * ${endpoint.title}\n * @method ${endpoint.method}\n */\n`;
  types += `export type ${endpoint.name}Endpoint`;
  if (endpoint.params.length) {
    types += `<\n`;
    for (const param of endpoint.params) {
      const type = getParamType(param);
      types += `  ${param} extends ${type} = ${type},\n`;
    }
    types += `>`;
  }
  types += ` = \`${endpoint.url}\`;\n\n`;
}

types += `export type Endpoint =\n`;
for (const _ in endpoints) {
  const i = Number(_);
  const endpoint = endpoints[i];
  types += `  | ${endpoint.name}Endpoint${
    i === endpoints.length - 1 ? ";" : ""
  }\n`;
}

const TYPES_FILE = new URL("../types/src/endpoints.ts", import.meta.url);
await Deno.writeTextFile(
  TYPES_FILE,
  types,
);

await $(
  "deno",
  "fmt",
  "-c",
  new URL("../deno.json", import.meta.url).pathname,
  TYPES_FILE.pathname,
);

console.log("Generated Endpoint Types!");