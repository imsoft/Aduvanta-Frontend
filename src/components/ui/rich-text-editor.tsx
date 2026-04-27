'use client';

import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import type { EditorState } from 'lexical';
import { cn } from '@/lib/utils';

// --- Toolbar ---

import { useLexicalComposerContext as useCtx } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  type TextFormatType,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode } from 'lexical';
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  ArrowCounterClockwise,
  ArrowClockwise,
  Quotes,
  Code,
} from '@phosphor-icons/react';

function ToolbarButton({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function Toolbar() {
  const [editor] = useCtx();

  const format = (fmt: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
  };

  const setHeading = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(`h${level}`));
      }
    });
  };

  const setParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
      {/* History */}
      <ToolbarButton title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        <ArrowCounterClockwise size={14} weight="bold" />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        <ArrowClockwise size={14} weight="bold" />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Headings */}
      <ToolbarButton title="Heading 1" onClick={() => setHeading(1)}>
        <span className="text-[11px] font-bold">H1</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 2" onClick={() => setHeading(2)}>
        <span className="text-[11px] font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 3" onClick={() => setHeading(3)}>
        <span className="text-[11px] font-bold">H3</span>
      </ToolbarButton>
      <ToolbarButton title="Paragraph" onClick={setParagraph}>
        <span className="text-[11px]">¶</span>
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Inline formatting */}
      <ToolbarButton title="Bold" onClick={() => format('bold')}>
        <TextB size={14} weight="bold" />
      </ToolbarButton>
      <ToolbarButton title="Italic" onClick={() => format('italic')}>
        <TextItalic size={14} />
      </ToolbarButton>
      <ToolbarButton title="Underline" onClick={() => format('underline')}>
        <TextUnderline size={14} />
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" onClick={() => format('strikethrough')}>
        <TextStrikethrough size={14} />
      </ToolbarButton>
      <ToolbarButton title="Inline code" onClick={() => format('code')}>
        <Code size={14} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Lists */}
      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <ListBullets size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <ListNumbers size={14} />
      </ToolbarButton>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Block */}
      <ToolbarButton
        title="Quote"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          });
        }}
      >
        <Quotes size={14} />
      </ToolbarButton>
    </div>
  );
}

// --- Initial value loader ---

function InitialValuePlugin({ markdown }: { markdown: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      $convertFromMarkdownString(markdown, TRANSFORMERS);
    });
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// --- Main component ---

const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  ListNode,
  ListItemNode,
];

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export function RichTextEditor({ value, onChange, placeholder, minHeight = 400 }: Props) {
  const initialConfig = {
    namespace: 'BlogEditor',
    nodes: EDITOR_NODES,
    onError: (error: Error) => {
      throw error;
    },
    // Empty initial state — InitialValuePlugin handles loading markdown
    editorState: null,
    theme: {
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        code: 'font-mono rounded bg-muted px-1 py-0.5 text-sm',
      },
      paragraph: 'mb-2 leading-7',
      heading: {
        h1: 'mb-3 mt-6 text-3xl font-bold tracking-tight first:mt-0',
        h2: 'mb-3 mt-5 text-2xl font-semibold tracking-tight first:mt-0',
        h3: 'mb-2 mt-4 text-xl font-semibold first:mt-0',
      },
      list: {
        ul: 'my-2 ml-5 list-disc space-y-1',
        ol: 'my-2 ml-5 list-decimal space-y-1',
        listitem: 'leading-7',
      },
      quote: 'my-3 border-l-4 border-border pl-4 italic text-muted-foreground',
      code: 'my-3 block rounded-lg bg-muted p-4 font-mono text-sm',
      link: 'text-primary underline underline-offset-4',
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      onChange(markdown);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          'w-full rounded-md border bg-background text-sm transition-colors',
          'focus-within:ring-1 focus-within:ring-ring',
        )}
      >
        <Toolbar />

        <div className="relative" style={{ minHeight }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="relative z-10 min-h-[inherit] w-full px-4 py-3 outline-none"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-3 text-muted-foreground">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>

      <InitialValuePlugin markdown={value} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
    </LexicalComposer>
  );
}
