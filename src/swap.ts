export function swapFormulaLine(line: string): string {
    const tildeIndex = line.indexOf("~");
    if (tildeIndex === -1) {
        return line;
    }

    // Find the left boundary of the LHS: stop at '(' or ','
    let lhsStart = tildeIndex - 1;
    while (lhsStart > 0 && !/[,(]/.test(line[lhsStart - 1])) {
        lhsStart--;
    }

    // Find the right boundary of the RHS: stop at ')' or ','
    let rhsEnd = tildeIndex + 1;
    while (rhsEnd < line.length && !/[,)]/.test(line[rhsEnd])) {
        rhsEnd++;
    }

    const prefix = line.slice(0, lhsStart);
    const suffix = line.slice(rhsEnd);

    // Separate leading whitespace from the LHS content so indentation is preserved
    const lhsRawFull = line.slice(lhsStart, tildeIndex);
    const indent = lhsRawFull.match(/^(\s*)/)?.[1] ?? "";
    const lhs = lhsRawFull.trim();
    const rhs = line.slice(tildeIndex + 1, rhsEnd).trimStart();

    // Trailing comma belongs to the line, not either side
    const trailingComma = lhs.endsWith(",") || rhs.endsWith(",") ? "," : "";
    const cleanLhs = lhs.endsWith(",") ? lhs.slice(0, -1).trimEnd() : lhs;
    const cleanRhs = rhs.endsWith(",") ? rhs.slice(0, -1).trimEnd() : rhs;

    return `${prefix}${indent}${cleanRhs} ~ ${cleanLhs}${trailingComma}${suffix}`;
}

export function swapFormulaText(text: string): string {
    return text
        .split("\n")
        .map(swapFormulaLine)
        .join("\n");
}
