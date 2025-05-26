"use client";

import { useState } from "react";
import { Editor } from "@/components/blocks/editor-00/editor";
import type { SerializedEditorState } from "lexical";

interface EditorComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function EditorComponent({
  value,
  onChange,
  placeholder,
}: EditorComponentProps) {
  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(value ? JSON.parse(value) : undefined);

  const handleChange = (state: SerializedEditorState) => {
    setEditorState(state);
    if (onChange) {
      onChange(JSON.stringify(state));
    }
  };

  return (
    <div className="border rounded-md">
      <Editor
        initialValue={editorState}
        onChange={handleChange}
        placeholder={placeholder || "Start writing..."}
      />
    </div>
  );
}
