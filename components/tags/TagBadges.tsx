"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { SquareDashed } from "lucide-react";

type Status = "active" | "inactive";

export type TagLike = {
  id: number | string;
  name: string;
  icon?: string | null;
  status?: Status;
};

type Size = "sm" | "md";

export interface TagBadgesProps {
  items: TagLike[];
  selectedIds?: number[] | string[];
  onToggle?: (id: number) => void;
  readOnly?: boolean;
  size?: Size;
  className?: string;
  badgeClassName?: string;
  dimInactive?: boolean;
}

const toNum = (v: number | string): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export function TagBadges({
  items,
  selectedIds,
  onToggle,
  readOnly = false,
  size = "md",
  className,
  badgeClassName,
  dimInactive = true,
}: TagBadgesProps) {
  const sel = React.useMemo(() => {
    if (!selectedIds) return new Set<number>();
    const s = new Set<number>();
    selectedIds.forEach((v) => {
      const n = toNum(v as any);
      if (n != null) s.add(n);
    });
    return s;
  }, [selectedIds]);

  const isInteractive = !readOnly && typeof onToggle === "function";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((t) => {
        const idNum = toNum(t.id);
        if (idNum == null) return null;

        const active = sel.has(idNum);
        const Icon = t.icon ? (LucideIcons as any)[t.icon] : null;

        const commonCls = cn(
          "gap-1",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2 py-1",
          dimInactive && t.status === "inactive" && "opacity-70",
          badgeClassName
        );

        if (isInteractive) {
          return (
            <Badge
              key={t.id}
              role="button"
              title={active ? "Clique para remover" : "Clique para adicionar"}
              onClick={() => onToggle?.(idNum)}
              variant={active ? "default" : "outline"}
              className={cn("cursor-pointer select-none", commonCls)}
            >
              {Icon ? <Icon className="size-4" /> : <SquareDashed className="size-4" />}
              {t.name}
            </Badge>
          );
        }

        return (
          <Badge
            key={t.id}
            variant="secondary"
            className={cn("select-none", commonCls)}
          >
            {Icon ? <Icon className="size-4" /> : <SquareDashed className="size-4" />}
            {t.name}
          </Badge>
        );
      })}
    </div>
  );
}

export default TagBadges;
