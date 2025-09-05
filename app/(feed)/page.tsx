'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import RandomFeed from '@/components/story/RandomFeed'
import FollowingFeed from '@/components/story/FollowingFeed'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Window</h1>
      <Tabs defaultValue="random">
        <TabsList>
          <TabsTrigger value="random">Random Lives</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="random">
          <RandomFeed />
        </TabsContent>
        <TabsContent value="following">
          <FollowingFeed />
        </TabsContent>
      </Tabs>
    </main>
  )
}
