import { Plugin, Editor, MarkdownView, Notice } from 'obsidian';


export default class CzechTextFixPlugin extends Plugin {
    onload() {
        // Command to fix selected text
        this.addCommand({
            id: 'fix-selected-czech-text',
            name: 'Fix Selected Czech Text',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const selectedText = editor.getSelection();
                const fixedText = this.replaceCzechCharacters(selectedText);
                editor.replaceSelection(fixedText);
            }
        });

        // Command to fix the whole document
        this.addCommand({
            id: 'fix-whole-czech-text',
            name: 'Fix Whole Czech Text',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const entireText = editor.getValue();
                const fixedText = this.replaceCzechCharacters(entireText);
                editor.setValue(fixedText);
            }
        });

        // Command to fix text from clipboard and insert at cursor
        this.addCommand({
            id: 'fix-clipboard-text-and-insert',
            name: 'Fix Clipboard Text and Insert at Cursor',
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                try {
                    const clipboardText = await navigator.clipboard.readText();
                    const fixedText = this.replaceCzechCharacters(clipboardText);
                    editor.replaceSelection(fixedText);
                    new Notice('Clipboard text fixed and inserted at cursor.');
                } catch (e) {
                    new Notice('Unable to access clipboard.');
                }
            },
            hotkeys: [
                // version for macOS
                {
                    modifiers: ["Mod", "Shift"],
                    key: "V" // Change this to your preferred shortcut
                },
                // version for Windows
                {
                    modifiers: ["Ctrl", "Shift"],
                    key: "V" // Change this to your preferred shortcut
                }
            ]
        });
    }

    replaceCzechCharacters(text: string): string {
        // Define replacements
        const replacements = {
            '´a': 'á', '´e': 'é', '´i': 'í', '´o': 'ó', '´u': 'ú', '´y': 'ý', '˚u': 'ů',
            'ˇc': 'č', 'ˇd': 'ď', 'ˇe': 'ě', 'ˇn': 'ň', 'ˇr': 'ř', 'ˇs': 'š', 'ˇt': 'ť', 'ˇz': 'ž',
            '´ı': 'í',
            // Add other replacements as needed
        };

        // Replace each occurrence
        for (const [badChar, goodChar] of Object.entries(replacements)) {
            const regex = new RegExp(badChar, 'g');
            text = text.replace(regex, goodChar);
        }

        return text.replace("˚u", "ů");
    }
}
