"use client";

import MediaAccount from "@/components/MediaAccount";
import useGetUserFollowing from "@/hooks/useGetUserFollowing";

export const revalidate = 0;
interface FollowingContentProps {
  userId: string;
}

const FollowingContent: React.FC<FollowingContentProps> = ({ userId }) => {
  const following = useGetUserFollowing(userId);
  if (following?.length! === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full h-[20vh] px-6">No songs</div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6 py-5">
      <div className="text-white text-xl font-semibold py-5">Watching</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
        {following?.map((song) => (
          <div
            key={song.following_id}
            className="flex items-center gap-x-4 w-full"
          >
            <div className="flex-1">
              <MediaAccount data={song}></MediaAccount>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingContent;
