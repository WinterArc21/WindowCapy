import PrivacyBadge from './PrivacyBadge'
import SensitiveContentBlur from './SensitiveContentBlur'
import ReactionBar from './ReactionBar'

export default function StoryCard({ story }: { story: any }) {
  const authorName = story.is_anonymous ? 'Anonymous' : story.author?.display_name || '—'
  return (
    <article className="rounded-xl border border-outline bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <div className="text-sm text-text/80">{authorName}</div>
        <PrivacyBadge privacy={story.privacy} />
      </header>
      {story.sensitive ? (
        <SensitiveContentBlur>
          <p className="whitespace-pre-wrap text-text/90">{story.content}</p>
        </SensitiveContentBlur>
      ) : (
        <p className="whitespace-pre-wrap text-text/90">{story.content}</p>
      )}
      {story.image_url ? (
        <img src={story.image_url} alt="Story image" className="mt-3 w-full rounded-lg border border-outline" />
      ) : null}
      {story.audio_url ? (
        <audio className="mt-3 w-full" controls src={story.audio_url} />
      ) : null}
      <ReactionBar storyId={story.id} />
    </article>
  )
}
