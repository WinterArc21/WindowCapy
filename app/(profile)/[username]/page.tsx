export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">@{params.username}</h1>
      <p className="text-text/70">Profile coming soon.</p>
    </main>
  )
}
