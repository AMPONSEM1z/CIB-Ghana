export const metadata = {
  title: "Auth Error - CIB Portal",
  description: "An authentication error occurred",
}

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="mt-2 text-muted-foreground">
          Something went wrong during authentication. Please try again.
        </p>
      </div>
    </main>
  )
}
