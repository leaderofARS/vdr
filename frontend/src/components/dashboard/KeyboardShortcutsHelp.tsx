import React from 'react';
import { X, Command, CornerDownLeft } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { key: 'G then H', description: 'Go to Hashes' },
      { key: 'G then A', description: 'Go to Analytics' },
      { key: 'G then T', description: 'Go to Team' },
      { key: 'G then K', description: 'Go to API Keys' },
      { key: 'G then S', description: 'Go to Settings' },
      { key: 'G then B', description: 'Go to Billing' },
      { key: 'G then U', description: 'Go to Usage' },
      { key: 'G then N', description: 'Go to Notifications' },
      { key: 'G then D', description: 'Go to Dashboard' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { key: '⌘/Ctrl + K', description: 'Open Command Palette' },
      { key: '/', description: 'Quick Search' },
      { key: 'N', description: 'Anchor New Document' },
      { key: '?', description: 'Show Keyboard Shortcuts' },
      { key: 'Esc', description: 'Close Modal / Cancel' },
    ],
  },
];

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-sipheron-surface border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sipheron-purple/10 flex items-center justify-center">
              <Command className="w-5 h-5 text-sipheron-purple" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sipheron-text-primary">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-sipheron-text-muted">
                Navigate faster with these shortcuts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-6">
            {shortcutGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-medium text-sipheron-text-muted uppercase tracking-wider mb-3">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="text-sm text-sipheron-text-secondary">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.key.split(' ').map((part, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && part === 'then' && (
                              <span className="text-xs text-sipheron-text-muted mx-1">then</span>
                            )}
                            {part !== 'then' && (
                              <kbd className="px-2 py-1 rounded bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-sipheron-text-primary min-w-[24px] text-center">
                                {part === '⌘/Ctrl' ? <Command className="w-3 h-3 inline" /> : part}
                              </kbd>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center justify-between text-xs text-sipheron-text-muted">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08]">?</kbd> anytime to show this help</span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sipheron-purple hover:text-sipheron-purple-light transition-colors"
            >
              Got it
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
