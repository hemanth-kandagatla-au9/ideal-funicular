export const createScriptDownloadData = (
  ogCommand,
  variableMapping,
  bashCodeSnippet
) => {
  if (!variableMapping?.length) {
    return ogCommand;
  }

  const description = variableMapping.map((v) => v.description).join(",");

  let fieldNames = variableMapping
    .map((v) => {
      if (v.fieldName[0] === "$") return v.fieldName.replace(/^\$/, "");
      else return v.fieldName;
    })
    .join(",");

  const printCommand =
    typeof bashCodeSnippet === "string"
      ? bashCodeSnippet
          .replace("__DESCRIPTION_PLACEHOLDER__", description)
          .replace("__FIELDNAME_PLACEHOLDER__", fieldNames)
      : "";
  const integratedCommand = `${ogCommand}\n${printCommand}`;
  return integratedCommand;
};

export const createPythonDownloadData = (
  ogCommand,
  variableMapping,
  pythonCodeTemplate
) => {
  if (!variableMapping?.length) {
    return ogCommand;
  }

  const description = variableMapping.map((el) => el.description);
  const fieldName = variableMapping.map((el) => el.fieldName);

  const pythonCodeSnippet = pythonCodeTemplate
    .replace("__DESCRIPTION_PLACEHOLDER__", JSON.stringify(description))
    .replace("__FIELDNAME_PLACEHOLDER__", JSON.stringify(fieldName));

  // -----------------FINAL INTEGRATED COMMAND -----------------
  const finalIntegratedCommand = `${ogCommand}\n${pythonCodeSnippet}`;
  return finalIntegratedCommand;
};

export const createPowershellDownloadData = (
  ogCommand,
  variableMapping,
  powerShellCodeSnippet
) => {
  if (!variableMapping?.length) {
    return ogCommand;
  }

  const description = variableMapping
    .map((v) => `"${v.description}"`)
    .join(", ");

  const fieldNames = variableMapping
    .map((v) => `"${v.fieldName.replace(/^\$/, "")}"`) // remove $
    .join(", ");
  let finalSnippet = powerShellCodeSnippet
    .replace("__DESCRIPTION_PLACEHOLDER__", description)
    .replace("__FIELDNAME_PLACEHOLDER__", fieldNames);
  const finalIntegratedCommand = `${ogCommand}\n${finalSnippet}`;
  return finalIntegratedCommand;
};
