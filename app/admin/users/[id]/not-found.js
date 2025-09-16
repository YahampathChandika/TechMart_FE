// app/(admin)/users/[id]/not-found.js
import Link from "next/link";
import { User, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist or has been removed from
            the system.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/admin/users">
            <Button className="w-full flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </Link>

          <Link href="/admin/users/create">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Add New User
            </Button>
          </Link>

          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full flex items-center gap-2">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
