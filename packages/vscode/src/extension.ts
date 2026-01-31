/**
 * @md2wp/vscode
 * VS Code extension for publishing markdown to WordPress
 *
 * Note: This is a scaffold only for v1
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('md2wp extension is now active');

  const publishCommand = vscode.commands.registerCommand(
    'md2wp.publish',
    () => {
      void vscode.window.showInformationMessage(
        'md2wp: Publish command not yet implemented',
      );
    },
  );

  context.subscriptions.push(publishCommand);
}

export function deactivate() {
  // Cleanup if needed
}
