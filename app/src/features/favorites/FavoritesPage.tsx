import { Star } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { EmptyState } from "@/components/EmptyState";
import { useFavoriteIds } from "@/hooks/personal";
import { resources } from "@/lib/content";

export function FavoritesPage() {
  const favIds = useFavoriteIds();
  const list = resources.filter((r) => favIds.has(r.id));

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Favorites"
        title="Favorites"
        description="Resources you've starred to keep close."
      />
      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Star}
            title="No favorites yet"
            description="Tap the star on any resource to pin it here for quick access."
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
