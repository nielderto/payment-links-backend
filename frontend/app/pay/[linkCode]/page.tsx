import { Button } from "@/components/ui/button";
import type { Link } from "@/lib/types";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getLink(linkCode: string): Promise<Link | null> {
  try {
    const res = await fetch(`${API_URL}/pay/${linkCode}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.link || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ linkCode: string }> }): Promise<Metadata> {
  const { linkCode } = await params;
  const link = await getLink(linkCode);
  if (!link) return { title: "Link Not Found" };

  return {
    title: `${link.productName} — $${(link.price / 100).toFixed(2)}`,
    description: link.productDescription,
    openGraph: {
      title: link.productName,
      description: link.productDescription,
      images: [link.imageUrl],
    },
  };
}

export default async function PaymentPage({ params }: { params: Promise<{ linkCode: string }> }) {
  const { linkCode } = await params;
  const link = await getLink(linkCode);

  if (!link) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold">Link Not Found</h1>
          <p className="text-muted-foreground">This payment link doesn&apos;t exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={link.imageUrl}
            alt={link.productName}
            className="h-56 w-full object-cover"
          />
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-xl font-semibold">{link.productName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{link.productDescription}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${(link.price / 100).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>

            <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/80 text-base">
              Pay Now
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Secure payment powered by Payment Links
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
