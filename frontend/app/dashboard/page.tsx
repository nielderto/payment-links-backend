"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/dashboard/search-bar";
import { LinkForm } from "@/components/dashboard/link-form";
import { LinkCard } from "@/components/dashboard/link-card";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import type { Link } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const data = await apiFetch("/links");
      setLinks(data.links || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }
    fetchLinks();
  }, [isAuthenticated, router, fetchLinks]);

  async function handleSearch() {
    if (!search.trim()) {
      fetchLinks();
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch(`/links/search?q=${encodeURIComponent(search)}`);
      setLinks(data.links || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingLink(null);
    setShowCreate(true);
  }

  function openEdit(link: Link) {
    setShowCreate(false);
    setEditingLink(link);
  }

  function closeForm() {
    setShowCreate(false);
    setEditingLink(null);
  }

  async function handleCreate(data: { productName: string; productDescription: string; price: string; imageUrl: string }) {
    await apiFetch("/links", {
      method: "POST",
      body: JSON.stringify(data),
    });
    closeForm();
    fetchLinks();
  }

  async function handleUpdate(data: { productName: string; productDescription: string; price: string; imageUrl: string }) {
    if (!editingLink) return;
    await apiFetch(`/links/${editingLink.linkCode}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    closeForm();
    fetchLinks();
  }

  async function handleDelete(linkCode: string) {
    if (!confirm("Delete this link?")) return;
    try {
      await apiFetch(`/links/${linkCode}`, { method: "DELETE" });
      fetchLinks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete link");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Payment Links</h1>
          <Button variant="ghost" onClick={logout} className="text-sm text-muted-foreground">
            Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} onCreate={openCreate} />

        {error && <p className="text-sm text-destructive">{error}</p>}

        {(showCreate || editingLink) && (
          <LinkForm
            editingLink={editingLink}
            onSubmit={editingLink ? handleUpdate : handleCreate}
            onCancel={closeForm}
          />
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading links...</p>
        ) : links.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No payment links yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
