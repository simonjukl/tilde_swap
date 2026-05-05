export function swapFormulaLine(line: string): string {
    const tildeIndex = line.indexOf("~");
    if (tildeIndex === -1) {
        return line;
    }

    const indent = line.match(/^(\s*)/)?.[1] ?? "";
    const body = line.slice(indent.length);

    // If the line (ignoring indent) starts with a formula, swap the whole line.
    // This covers: standalone formulas, and case_when / recode_values arguments
    // where the formula is the only thing on the line.
    const tildeInBody = body.indexOf("~");
    const beforeTilde = body.slice(0, tildeInBody);
    const isStandalone = !/[,(]/.test(beforeTilde);

    if (isStandalone) {
        const lhsRaw = body.slice(0, tildeInBody).trimEnd();
        const rhsRaw = body.slice(tildeInBody + 1).trimStart();

        const trailingComma = rhsRaw.endsWith(",") ? "," : "";
        const lhs = lhsRaw.endsWith(",") ? lhsRaw.slice(0, -1).trimEnd() : lhsRaw;
        const rhs = trailingComma ? rhsRaw.slice(0, -1).trimEnd() : rhsRaw;

        return `${indent}${rhs} ~ ${lhs}${trailingComma}`;
    }

    // Inline formula inside a function call: find the formula boundaries
    // by scanning left to '(' or ',' and right to ')' or ','
    let lhsStart = tildeIndex - 1;
    while (lhsStart > 0 && !/[,(]/.test(line[lhsStart - 1])) {
        lhsStart--;
    }
    let rhsEnd = tildeIndex + 1;
    while (rhsEnd < line.length && !/[,)]/.test(line[rhsEnd])) {
        rhsEnd++;
    }

    const prefix = line.slice(0, lhsStart);
    const suffix = line.slice(rhsEnd);
    const lhs = line.slice(lhsStart, tildeIndex).trim();
    const rhs = line.slice(tildeIndex + 1, rhsEnd).trim();

    return `${prefix}${rhs} ~ ${lhs}${suffix}`;
}

export function swapFormulaText(text: string): string {
    return text
        .split("\n")
        .map(swapFormulaLine)
        .join("\n");
}
