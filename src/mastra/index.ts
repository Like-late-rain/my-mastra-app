import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { Mastra } from "@mastra/core/mastra";
import { poetryAgent } from "./agents/poetry-agent";

const agents = { poetryAgent };

const aliasMap: Record<string, keyof typeof agents> = {
  weatherAgent: "poetryAgent",
};

export const mastra = new Mastra({
  agents,
  deployer: new CloudflareDeployer({
    projectName: process.env.CF_PROJECT_NAME ?? "agent-mastra",
    env: {
      NODE_ENV: process.env.NODE_ENV ?? "production",
    },
  }),
});

const baseGetAgent =
  typeof mastra.getAgent === "function"
    ? mastra.getAgent.bind(mastra)
    : null;

if (baseGetAgent) {
  mastra.getAgent = ((name) => {
    const resolvedName =
      aliasMap[name as string] ?? (name as keyof typeof agents);
    return baseGetAgent(resolvedName);
  }) as typeof mastra.getAgent;
}
