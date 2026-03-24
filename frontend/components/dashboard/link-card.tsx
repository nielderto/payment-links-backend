"use client";

import { Button } from "@/components/ui/button";
import type { Link } from "@/lib/types";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (linkCode: string) => void;
}

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  function handleCopy() {
    navigator.clipboard.writeText(`${window.location.origin}/pay/${link.linkCode}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{link.productName}</h3>
          {!link.isActive && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Inactive</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{link.productDescription}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <a
            href={`/pay/${link.linkCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-primary hover:underline"
          >
            {link.linkCode}
          </a>
          <span>${(link.price / 100).toFixed(2)}</span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          Copy Link
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(link)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(link.linkCode)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
