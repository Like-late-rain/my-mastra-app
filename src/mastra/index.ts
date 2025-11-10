import { Mastra } from "@mastra/core/mastra";
import { poetryAgent } from "./agents/poetry-agent";

const agents = { poetryAgent };

const aliasMap: Record<string, keyof typeof agents> = {
  weatherAgent: "poetryAgent",
};

const mastraInstance = new Mastra({
  agents,
});

const baseGetAgent = mastraInstance.getAgent.bind(mastraInstance);
mastraInstance.getAgent = ((name) => {
  const resolvedName =
    aliasMap[name as string] ?? (name as keyof typeof agents);
  return baseGetAgent(resolvedName);
}) as typeof mastraInstance.getAgent;

export const mastra = mastraInstance;
