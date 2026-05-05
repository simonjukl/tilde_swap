import * as assert from 'assert';
import { swapFormulaLine, swapFormulaText } from '../swap';

suite('swapFormulaLine', () => {

    suite('basic cases', () => {
        test('swaps simple formula', () => {
            assert.strictEqual(swapFormulaLine('y ~ x'), 'x ~ y');
        });

        test('swaps quoted strings', () => {
            assert.strictEqual(swapFormulaLine('"A" ~ "B"'), '"B" ~ "A"');
        });

        test('swaps multi-term RHS', () => {
            assert.strictEqual(swapFormulaLine('y ~ x1 + x2'), 'x1 + x2 ~ y');
        });

        test('swaps multi-term LHS', () => {
            assert.strictEqual(swapFormulaLine('x1 + x2 ~ y'), 'y ~ x1 + x2');
        });

        test('returns line unchanged when no tilde', () => {
            assert.strictEqual(swapFormulaLine('no tilde here'), 'no tilde here');
        });

        test('returns empty string unchanged', () => {
            assert.strictEqual(swapFormulaLine(''), '');
        });
    });

    suite('whitespace handling', () => {
        test('preserves leading indentation', () => {
            assert.strictEqual(swapFormulaLine('  y ~ x'), '  x ~ y');
        });

        test('preserves tab indentation', () => {
            assert.strictEqual(swapFormulaLine('\ty ~ x'), '\tx ~ y');
        });

        test('trims extra spaces around tilde', () => {
            assert.strictEqual(swapFormulaLine('y   ~   x'), 'x ~ y');
        });
    });

    suite('R formula patterns', () => {
        test('one-sided formula (no LHS)', () => {
            // "~ x" has empty LHS — swap gives "x ~ "
            assert.strictEqual(swapFormulaLine('~ x'), 'x ~ ');
        });

        test('splits on first tilde only (nested formula)', () => {
            // update(old, . ~ . + x) — tilde at index of first ~
            assert.strictEqual(swapFormulaLine('a ~ b ~ c'), 'b ~ c ~ a');
        });

        test('handles spaces in variable names (backtick)', () => {
            assert.strictEqual(swapFormulaLine('`my var` ~ x'), 'x ~ `my var`');
        });

        test('case_when style: quoted value ~ quoted label', () => {
            assert.strictEqual(swapFormulaLine('  "old" ~ "new"'), '  "new" ~ "old"');
        });
    });

});

suite('swapFormulaText', () => {

    test('swaps every formula line in a block', () => {
        const input = [
            '  "A" ~ "B"',
            '  "C" ~ "D"',
            '  "E" ~ "F"',
        ].join('\n');
        const expected = [
            '  "B" ~ "A"',
            '  "D" ~ "C"',
            '  "F" ~ "E"',
        ].join('\n');
        assert.strictEqual(swapFormulaText(input), expected);
    });

    test('passes through lines without tilde unchanged', () => {
        const input = 'case_when(\n  x ~ y\n)';
        const expected = 'case_when(\n  y ~ x\n)';
        assert.strictEqual(swapFormulaText(input), expected);
    });

    test('single line is equivalent to swapFormulaLine', () => {
        assert.strictEqual(swapFormulaText('y ~ x'), swapFormulaLine('y ~ x'));
    });

});
