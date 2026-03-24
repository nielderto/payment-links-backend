"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Link } from "@/lib/types";

interface LinkFormProps {
  editingLink: Link | null;
  onSubmit: (data: { productName: string; productDescription: string; price: string; imageUrl: string }) => Promise<void>;
  onCancel: () => void;
}

export function LinkForm({ editingLink, onSubmit, onCancel }: LinkFormProps) {
  const [name, setName] = useState(editingLink?.productName || "");
  const [desc, setDesc] = useState(editingLink?.productDescription || "");
  const [price, setPrice] = useState(editingLink ? (editingLink.price / 100).toFixed(2) : "");
  const [image, setImage] = useState(editingLink?.imageUrl || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ productName: name, productDescription: desc, price, imageUrl: image });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">
          {editingLink ? "Edit Link" : "Create New Link"}
        </h2>
        <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Product Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Blue T-Shirt" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Price ($)</label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="29.99" type="number" step="0.01" min="0.01" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Input value={desc} onChange={(e) => setDesc(e.target.value)} required placeholder="A nice product description" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} required placeholder="https://example.com/image.jpg" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving} className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/80">
            {saving ? "Saving..." : editingLink ? "Update Link" : "Create Link"}
          </Button>
        </div>
      </form>
    </div>
  );
}
