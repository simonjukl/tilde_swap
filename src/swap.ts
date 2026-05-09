export function swapFormulaLine(line: string): string {
    const tildeIndex = line.indexOf("~");
    if (tildeIndex === -1) {
        return line;
    }

    const indent = line.match(/^(\s*)/)?.[1] ?? "";
    const body = line.slice(indent.length);
    const tildeInBody = body.indexOf("~");
    const beforeTilde = body.slice(0, tildeInBody);

    // Standalone: nothing before the LHS except whitespace (and optional trailing comma)
    // Covers case_when / recode_values multiline argument lines
    if (!/[,(]/.test(beforeTilde)) {
        const lhsRaw = beforeTilde.trimEnd();
        const rhsRaw = body.slice(tildeInBody + 1).trimStart();

        const trailingComma = rhsRaw.endsWith(",") || lhsRaw.endsWith(",") ? "," : "";
        const lhs = lhsRaw.endsWith(",") ? lhsRaw.slice(0, -1).trimEnd() : lhsRaw;
        const rhs = rhsRaw.endsWith(",") ? rhsRaw.slice(0, -1).trimEnd() : rhsRaw;

        return `${indent}${rhs} ~ ${lhs}${trailingComma}`;
    }

    // Inline: scan left from tilde to find LHS start, tracking paren depth
    let depth = 0;
    let lhsStart = tildeIndex - 1;
    while (lhsStart > 0) {
        const ch = line[lhsStart - 1];
        if (ch === ')') { depth++; }
        else if (ch === '(') {
            if (depth === 0) { break; }
            depth--;
        } else if (ch === ',' && depth === 0) { break; }
        lhsStart--;
    }

    // Scan right from tilde to find RHS end, tracking paren depth
    depth = 0;
    let rhsEnd = tildeIndex + 1;
    while (rhsEnd < line.length) {
        const ch = line[rhsEnd];
        if (ch === '(') { depth++; }
        else if (ch === ')') {
            if (depth === 0) { break; }
            depth--;
        } else if (ch === ',' && depth === 0) { break; }
        rhsEnd++;
    }

    const lhsSlice = line.slice(lhsStart, tildeIndex);
    const lhsLeadingSpace = lhsSlice.match(/^(\s*)/)?.[1] ?? "";
    const lhs = lhsSlice.trim();
    const rhs = line.slice(tildeIndex + 1, rhsEnd).trim();

    const prefix = line.slice(0, lhsStart);
    const suffix = line.slice(rhsEnd);

    return `${prefix}${lhsLeadingSpace}${rhs} ~ ${lhs}${suffix}`;
}

export function swapFormulaText(text: string, multiline: boolean = true): string {
    const crlf = text.includes("\r\n");
    const lines = text.split(/\r?\n/);

    if (!multiline && lines.length > 1) {
        return text;
    }

    return lines.map(swapFormulaLine).join(crlf ? "\r\n" : "\n");
}
