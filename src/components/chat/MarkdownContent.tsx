import React from "react";
import { marked, type Token, type Tokens } from "marked";

export function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  // Normalize bullet points and standardize markdown text
  const normalized = React.useMemo(() => {
    if (!content) return "";
    // Normalize bullet dots (•) to markdown hyphens (-)
    return content.replace(/^([ \t]*)•[ \t]+/gm, "$1- ");
  }, [content]);

  // Parse tokens with marked lexer (CommonMark & GitHub Flavored Markdown)
  const tokens = React.useMemo(() => {
    try {
      return marked.lexer(normalized, { gfm: true, breaks: true });
    } catch (err) {
      console.error("Markdown parse error:", err);
      return [];
    }
  }, [normalized]);

  return (
    <div className={`markdown-body space-y-2 text-sm leading-relaxed text-[var(--text-primary)] ${className}`}>
      {tokens.map((token, idx) => (
        <BlockToken key={idx} token={token} index={idx} />
      ))}
    </div>
  );
}

function BlockToken({ token, index }: { token: Token; index: number }): React.ReactNode {
  switch (token.type) {
    case "heading": {
      const headingToken = token as Tokens.Heading;
      const inner = headingToken.tokens ? (
        <InlineTokens tokens={headingToken.tokens} />
      ) : (
        headingToken.text
      );

      if (headingToken.depth === 1) {
        return (
          <h1
            key={index}
            className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-4 mb-2 pb-1 border-b border-[var(--border-hairline)] leading-snug tracking-tight"
          >
            {inner}
          </h1>
        );
      }
      if (headingToken.depth === 2) {
        return (
          <h2
            key={index}
            className="text-sm sm:text-base font-bold text-[var(--text-primary)] mt-3.5 mb-1.5 text-[var(--text-primary)] leading-snug tracking-tight"
          >
            {inner}
          </h2>
        );
      }
      if (headingToken.depth === 3) {
        return (
          <h3
            key={index}
            className="text-sm sm:text-[15px] font-semibold text-[var(--text-primary)] mt-3 mb-1.5 flex items-center gap-1.5 leading-snug"
          >
            {inner}
          </h3>
        );
      }
      return (
        <h4
          key={index}
          className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-2.5 mb-1 leading-snug"
        >
          {inner}
        </h4>
      );
    }

    case "paragraph": {
      const pToken = token as Tokens.Paragraph;
      return (
        <p key={index} className="leading-relaxed my-1.5 text-[var(--text-primary)]">
          {pToken.tokens ? <InlineTokens tokens={pToken.tokens} /> : pToken.text}
        </p>
      );
    }

    case "list": {
      const listToken = token as Tokens.List;
      if (listToken.ordered) {
        return (
          <ol key={index} className="list-decimal pl-5 space-y-1 my-2">
            {listToken.items.map((item, i) => (
              <li key={i} className="text-sm leading-relaxed text-[var(--text-primary)]">
                {item.tokens ? (
                  item.tokens.map((t, ti) => <BlockToken key={ti} token={t} index={ti} />)
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <ul key={index} className="space-y-1.5 my-2 pl-0.5">
          {listToken.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--text-primary)]">
              <span className="text-[var(--text-tertiary)] select-none mt-1 text-[11px]">•</span>
              <div className="flex-1 min-w-0">
                {item.tokens ? (
                  item.tokens.map((t, ti) => (
                    t.type === "text" && (t as any).tokens ? (
                      <InlineTokens key={ti} tokens={(t as any).tokens} />
                    ) : (
                      <BlockToken key={ti} token={t} index={ti} />
                    )
                  ))
                ) : (
                  item.text
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    }

    case "code": {
      const codeToken = token as Tokens.Code;
      return (
        <div key={index} className="my-2 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] overflow-hidden">
          {codeToken.lang && (
            <div className="px-3 py-1 bg-[var(--bg-base)] border-b border-[var(--border-hairline)] text-[10px] font-mono text-[var(--text-tertiary)] uppercase">
              {codeToken.lang}
            </div>
          )}
          <pre className="p-3 overflow-x-auto text-xs font-mono text-[var(--text-primary)]">
            <code>{codeToken.text}</code>
          </pre>
        </div>
      );
    }

    case "blockquote": {
      const bToken = token as Tokens.Blockquote;
      return (
        <blockquote key={index} className="border-l-2 border-[var(--border-hairline-strong)] pl-3 my-2 italic text-[var(--text-secondary)]">
          {bToken.tokens ? (
            bToken.tokens.map((t, ti) => <BlockToken key={ti} token={t} index={ti} />)
          ) : (
            bToken.text
          )}
        </blockquote>
      );
    }

    case "hr": {
      return <hr key={index} className="border-t border-[var(--border-hairline)] my-3" />;
    }

    case "space": {
      return null;
    }

    case "table": {
      const tToken = token as Tokens.Table;
      return (
        <div key={index} className="my-3 overflow-x-auto rounded-md border border-[var(--border-hairline)]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--bg-surface-2)] border-b border-[var(--border-hairline)] text-[var(--text-primary)] font-mono">
              <tr>
                {tToken.header.map((cell, ci) => (
                  <th key={ci} className="px-3 py-2 font-semibold">
                    {cell.tokens ? <InlineTokens tokens={cell.tokens} /> : cell.text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {tToken.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-white/[0.02]">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-[var(--text-secondary)]">
                      {cell.tokens ? <InlineTokens tokens={cell.tokens} /> : cell.text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    default: {
      if ((token as any).tokens) {
        return <InlineTokens key={index} tokens={(token as any).tokens} />;
      }
      return <p key={index} className="my-1 text-[var(--text-primary)]">{token.raw || (token as any).text}</p>;
    }
  }
}

function InlineTokens({ tokens }: { tokens: Token[] }): React.ReactNode {
  return (
    <>
      {tokens.map((token, idx) => (
        <InlineToken key={idx} token={token} index={idx} />
      ))}
    </>
  );
}

function InlineToken({ token, index }: { token: Token; index: number }): React.ReactNode {
  switch (token.type) {
    case "strong": {
      const sToken = token as Tokens.Strong;
      return (
        <strong key={index} className="font-semibold text-[var(--text-primary)]">
          {sToken.tokens ? <InlineTokens tokens={sToken.tokens} /> : sToken.text}
        </strong>
      );
    }

    case "em": {
      const eToken = token as Tokens.Em;
      return (
        <em key={index} className="italic text-[var(--text-primary)]">
          {eToken.tokens ? <InlineTokens tokens={eToken.tokens} /> : eToken.text}
        </em>
      );
    }

    case "codespan": {
      const cToken = token as Tokens.Codespan;
      return (
        <code
          key={index}
          className="font-mono text-[11px] sm:text-[12px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-2)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
        >
          {cToken.text}
        </code>
      );
    }

    case "link": {
      const lToken = token as Tokens.Link;
      return (
        <a
          key={index}
          href={lToken.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7A8C7A] hover:underline underline-offset-2 transition-colors"
        >
          {lToken.tokens ? <InlineTokens tokens={lToken.tokens} /> : lToken.text}
        </a>
      );
    }

    case "del": {
      const dToken = token as Tokens.Del;
      return (
        <del key={index} className="line-through text-[var(--text-tertiary)]">
          {dToken.tokens ? <InlineTokens tokens={dToken.tokens} /> : dToken.text}
        </del>
      );
    }

    case "br": {
      return <br key={index} />;
    }

    case "text": {
      const tToken = token as Tokens.Text;
      if (tToken.tokens && tToken.tokens.length > 0) {
        return <InlineTokens key={index} tokens={tToken.tokens} />;
      }
      return <React.Fragment key={index}>{tToken.text}</React.Fragment>;
    }

    case "escape": {
      const escToken = token as Tokens.Escape;
      return <React.Fragment key={index}>{escToken.text}</React.Fragment>;
    }

    default: {
      return <React.Fragment key={index}>{token.raw || (token as any).text || ""}</React.Fragment>;
    }
  }
}
