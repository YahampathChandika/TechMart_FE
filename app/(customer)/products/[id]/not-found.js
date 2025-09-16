// app/(customer)/products/[id]/not-found.js
import Link from "next/link";
import { Package, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/products">
            <Button className="w-full flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <Link href="/search">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
