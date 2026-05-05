export function swapFormulaLine(line: string): string {
    const tildeIndex = line.indexOf("~");
    if (tildeIndex === -1) {
        return line;
    }

    const indent = line.match(/^(\s*)/)?.[1] ?? "";
    const lhsRaw = line.slice(indent.length, tildeIndex).trimEnd();
    const rhsRaw = line.slice(tildeIndex + 1).trimStart();

    // Trailing comma is a function argument separator, not part of either side
    const trailingComma = rhsRaw.endsWith(",") || lhsRaw.endsWith(",") ? "," : "";
    const lhs = lhsRaw.endsWith(",") ? lhsRaw.slice(0, -1).trimEnd() : lhsRaw;
    const rhs = rhsRaw.endsWith(",") ? rhsRaw.slice(0, -1).trimEnd() : rhsRaw;

    return `${indent}${rhs} ~ ${lhs}${trailingComma}`;
}

export function swapFormulaText(text: string): string {
    return text
        .split("\n")
        .map(swapFormulaLine)
        .join("\n");
}
