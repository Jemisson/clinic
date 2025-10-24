'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

type Props = {
  icon: React.ReactNode;
  title: string;
  url: string;
  date?: string | null;
  status?: 'ok' | 'missing' | null;
};

export default function AttachmentItem({
  icon,
  title,
  url,
  date,
  status = null,
}: Props) {
  return (
    <a
      href={url}
      target='_blank'
      className="block transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
    >
      <Card className="hover:bg-muted/40 transition border-0 shadow-sm w-[140px] sm:w-[160px] mx-auto">
        <CardContent className="p-4">
          <div className="relative flex flex-col items-center text-center gap-3">
            {/* Ícone */}
            <div className="relative">
              <div className="h-16 w-12 sm:h-20 sm:w-16 rounded-md border flex items-center justify-center bg-white">
                {icon}
              </div>
              {status && <StatusBadge status={status} />}
            </div>

            {/* Título e data */}
            <div className="space-y-1 w-full">
              <div className="text-sm sm:text-base font-medium leading-tight text-center break-words">
                {title}
              </div>
              {date && (
                <div className="text-xs text-muted-foreground text-center">
                  {date}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'missing' }) {
  const ok = status === 'ok';
  return (
    <div className="absolute -right-3 -top-3">
      <div
        className={[
          'inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white',
          ok ? 'border-emerald-600' : 'border-red-600',
        ].join(' ')}
        aria-label={ok ? 'preenchido' : 'pendente'}
        title={ok ? 'Preenchido' : 'Pendente'}
      >
        {ok ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
      </div>
    </div>
  );
}
