import { useEffect, useState } from "react";

type Props = {
  node: any;
};

export default function NodeDetails({ node }: Props) {
  const [note, setNote] = useState("");

  // ----------------------------------
  // Load saved note for this node
  // ----------------------------------
  useEffect(() => {
    if (!node?.id) return;

    const savedNotes = JSON.parse(
      localStorage.getItem("cortex_node_notes") || "{}"
    );

    setNote(savedNotes[node.id] || "");
  }, [node]);

  // ----------------------------------
  // Persist note on change
  // ----------------------------------
  function handleNoteChange(value: string) {
    setNote(value);

    const savedNotes = JSON.parse(
      localStorage.getItem("cortex_node_notes") || "{}"
    );

    savedNotes[node.id] = value;

    localStorage.setItem(
      "cortex_node_notes",
      JSON.stringify(savedNotes)
    );
  }

  if (!node) return null;

  return (
    <div className="mt-4 rounded-md border p-4 bg-gray-50 space-y-3">
      <h4 className="font-semibold">Node Details</h4>

      <div className="text-sm space-y-1">
        <div>
          <strong>Type:</strong> {node.type}
        </div>

        <div>
          <strong>Label:</strong> {node.label}
        </div>

        {node.description && (
          <div>
            <strong>Description:</strong> {node.description}
          </div>
        )}

        {node.statement && (
          <div>
            <strong>Statement:</strong> {node.statement}
          </div>
        )}

        {node.importance !== undefined && (
          <div>
            <strong>Importance:</strong>{" "}
            {Math.round(node.importance * 100)}%
          </div>
        )}

        {node.confidence !== undefined && (
          <div>
            <strong>Confidence:</strong>{" "}
            {Math.round(node.confidence * 100)}%
          </div>
        )}
      </div>

      {/* ----------------------------------
          Annotation
      ---------------------------------- */}
      <div>
        <label className="block text-xs font-semibold mb-1">
          Your note
        </label>
        <textarea
          className="w-full rounded-md border p-2 text-sm resize-none"
          rows={3}
          placeholder="Add your thoughts, clarifications, or questions about this node…"
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
        />
      </div>
    </div>
  );
}
