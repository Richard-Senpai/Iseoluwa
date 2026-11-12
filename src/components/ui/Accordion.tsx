'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

/**
 * Accessible FAQ Accordion with hairline dividers, `add` / `remove` icons,
 * and smooth expand/collapse using CSS grid rows.
 */
export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const handleToggle = (id: string, question: string) => {
    const nextId = openId === id ? null : id;
    setOpenId(nextId);
    if (nextId) {
      track('faq_opened', { id, question });
    }
  };

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;
        const numberLabel = String(idx + 1).padStart(2, '0');

        return (
          <div key={item.id} className="py-6 md:py-8">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(item.id, item.question)}
                className="group flex w-full items-start justify-between gap-6 text-left"
              >
                <span className="flex items-baseline gap-4 md:gap-8">
                  <span className="text-label-mono text-ink-muted">{numberLabel}</span>
                  <span className="text-heading-m text-ink transition-colors duration-200 group-hover:text-ink-muted">
                    {item.question}
                  </span>
                </span>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 group-hover:border-line-accent">
                  <Icon name={isOpen ? 'remove' : 'add'} size={20} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="text-body max-w-[65ch] pt-4 pl-8 text-ink-muted md:pt-6 md:pl-14">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
