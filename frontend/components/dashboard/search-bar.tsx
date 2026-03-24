"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
}

export function SearchBar({ value, onChange, onSearch, onCreate }: SearchBarProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch();
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-md">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name or link code..."
        />
        <Button type="submit" className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/80">
          Search
        </Button>
      </form>
      <Button onClick={onCreate} className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/80">
        + New Link
      </Button>
    </div>
  );
}
