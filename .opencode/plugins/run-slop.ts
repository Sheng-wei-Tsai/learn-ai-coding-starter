import { Plugin } from "@opencode/plugin";

export default Plugin.define({
  id: "sloperator.run-slop",
  setup: async (ctx) => {
    const root = ctx.location.project.directory;

    await ctx.tool.transform((tools) => {
      tools.add({
        name: "run_slop",
        description:
          "Run a SlopLang program with Sloperator and return its stdout, stderr, and exit code as JSON.",
        input: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description:
                "Path to the .slop file, relative to the project root or absolute.",
            },
          },
          required: ["path"],
          additionalProperties: false,
        },
        options: { codemode: false },
        execute: async (input) => {
          const { path } = input as { path: string };

          try {
            const proc = Bun.spawn(["uv", "run", "--no-active", "sloperator.py", path], {
              cwd: root,
              stdout: "pipe",
              stderr: "pipe",
            });

            const [stdout, stderr, exitCode] = await Promise.all([
              new Response(proc.stdout).text(),
              new Response(proc.stderr).text(),
              proc.exited,
            ]);

            return { content: JSON.stringify({ stdout, stderr, exitCode }) };
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return { content: JSON.stringify({ stdout: "", stderr: message, exitCode: -1 }) };
          }
        },
      });
    });
  },
});
