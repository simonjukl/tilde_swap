import * as vscode from 'vscode';
import { swapFormulaText } from './swap';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('tilde-swap.swapFormula', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const multiline = vscode.workspace
            .getConfiguration('tilde-swap')
            .get<boolean>('multiline', true);

        const document = editor.document;
        const selections = editor.selections;

        editor.edit(editBuilder => {
            for (const selection of selections) {
                if (selection.isEmpty) {
                    const line = document.lineAt(selection.active.line);
                    const swapped = swapFormulaText(line.text, multiline);
                    if (swapped !== line.text) {
                        editBuilder.replace(line.range, swapped);
                    }
                } else {
                    const text = document.getText(selection);
                    const swapped = swapFormulaText(text, multiline);
                    if (swapped !== text) {
                        editBuilder.replace(selection, swapped);
                    }
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
