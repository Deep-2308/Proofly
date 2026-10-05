"use client";

import { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";

function CodeExtractor({
  onChange,
}: {
  onChange: (code: string) => void;
}) {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    // Extract the code from the active file
    const activeCode = sandpack.files[sandpack.activeFile]?.code || "";
    onChange(activeCode);
  }, [sandpack.files, sandpack.activeFile, onChange]);

  return null;
}

export function LiveSandbox({
  template = "react",
  onCodeChange,
}: {
  template?: "react" | "vanilla" | "node" | "nextjs" | "vue";
  onCodeChange: (code: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-2xl">
      <SandpackProvider
        template={template as any}
        theme={atomDark}
        options={{
          classes: {
            "sp-layout": "h-[450px] !border-none",
            "sp-editor": "!bg-surface",
            "sp-preview": "!bg-surface-2",
          },
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor showTabs showLineNumbers showRunButton />
          <SandpackPreview showNavigator />
        </SandpackLayout>
        <CodeExtractor onChange={onCodeChange} />
      </SandpackProvider>
    </div>
  );
}
