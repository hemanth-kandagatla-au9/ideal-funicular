import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

function WebIde(props) {
  const {
    language,
    onChange,
    height,
    value = "",
    defaultValue = "",
    selectedMode = false,
  } = props;
  const globalVarInstr = ``;
  const editorRef = useRef(null);

  const handleKeyDown = async (event) => {
    const { keyCode, ctrlKey, metaKey } = event;
    if ((keyCode === 33 || keyCode === 54) && (metaKey || ctrlKey)) {
      event.preventDefault();
    }
  };
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  const jsDefaultValue = ``;
  let webIdeDefaultValue = "";
  switch (language) {
    case "javascript":
      webIdeDefaultValue = `${jsDefaultValue}${globalVarInstr}`;
      break;
    case "bash":
      webIdeDefaultValue = `: <<COMMENT${defaultValue} ${globalVarInstr}COMMENT`;
      break;
    default:
      webIdeDefaultValue = `${defaultValue} ${globalVarInstr}`;
      break;
  }
  return (
    <Editor
      height={height}
      value={value}
      language={language}
      onMount={handleEditorDidMount}
      onChange={onChange}
      defaultValue={webIdeDefaultValue}
      options={{ contextmenu: false, readOnly: !selectedMode }}
    />
  );
}

export default WebIde;
