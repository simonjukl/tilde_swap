import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { swapFormulaLine, swapFormulaText } from '../swap';

describe('swapFormulaLine', () => {

    describe('basic cases', () => {
        it('swaps simple formula', () => {
            assert.equal(swapFormulaLine('y ~ x'), 'x ~ y');
        });

        it('swaps quoted strings', () => {
            assert.equal(swapFormulaLine('"A" ~ "B"'), '"B" ~ "A"');
        });

        it('swaps multi-term RHS', () => {
            assert.equal(swapFormulaLine('y ~ x1 + x2'), 'x1 + x2 ~ y');
        });

        it('swaps multi-term LHS', () => {
            assert.equal(swapFormulaLine('x1 + x2 ~ y'), 'y ~ x1 + x2');
        });

        it('returns line unchanged when no tilde', () => {
            assert.equal(swapFormulaLine('no tilde here'), 'no tilde here');
        });

        it('returns empty string unchanged', () => {
            assert.equal(swapFormulaLine(''), '');
        });
    });

    describe('whitespace handling', () => {
        it('preserves leading indentation', () => {
            assert.equal(swapFormulaLine('  y ~ x'), '  x ~ y');
        });

        it('preserves tab indentation', () => {
            assert.equal(swapFormulaLine('\ty ~ x'), '\tx ~ y');
        });

        it('trims extra spaces around tilde', () => {
            assert.equal(swapFormulaLine('y   ~   x'), 'x ~ y');
        });
    });

    describe('R formula patterns', () => {
        it('one-sided formula (no LHS)', () => {
            assert.equal(swapFormulaLine('~ x'), 'x ~ ');
        });

        it('splits on first tilde only', () => {
            assert.equal(swapFormulaLine('a ~ b ~ c'), 'b ~ c ~ a');
        });

        it('handles backtick variable names', () => {
            assert.equal(swapFormulaLine('`my var` ~ x'), 'x ~ `my var`');
        });

        it('case_when style: quoted value ~ quoted label', () => {
            assert.equal(swapFormulaLine('  "old" ~ "new"'), '  "new" ~ "old"');
        });
    });

});

describe('swapFormulaText', () => {

    it('swaps every formula line in a block', () => {
        const input = '  "A" ~ "B"\n  "C" ~ "D"\n  "E" ~ "F"';
        const expected = '  "B" ~ "A"\n  "D" ~ "C"\n  "F" ~ "E"';
        assert.equal(swapFormulaText(input), expected);
    });

    it('passes through lines without tilde unchanged', () => {
        const input = 'case_when(\n  x ~ y\n)';
        const expected = 'case_when(\n  y ~ x\n)';
        assert.equal(swapFormulaText(input), expected);
    });

    it('single line is equivalent to swapFormulaLine', () => {
        assert.equal(swapFormulaText('y ~ x'), swapFormulaLine('y ~ x'));
    });

});
