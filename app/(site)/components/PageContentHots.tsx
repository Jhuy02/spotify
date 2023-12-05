"use client";

import useOnPlay from "@/hooks/useOnPlay";
import { liked_songs } from "@/types";
import HotsItems from "./HotsItems";

interface PageContentProps {
  data?: liked_songs[];
}

const PageContentHots: React.FC<PageContentProps> = ({ data }) => {
  const countMap: { [songId: string]: { count: number; item: liked_songs } } =
    {};
  data?.forEach((item) => {
    const songId = item?.song_id;
    if (!countMap[songId]) {
      countMap[songId] = { count: 0, item: item };
    }
    countMap[songId].count++;
  });
  const countArray = Object.keys(countMap).map((songId) => ({
    song_id: parseInt(songId),
    ...countMap[parseInt(songId)],
  }));
  countArray.sort((a, b) => b.count - a.count);
  const top = countArray.slice(0, 6).map((item) => ({ ...item.item }));
  const topSong = countArray.slice(0, 6).map((item) => {
    const topItem = { ...item.item };
    const topSongItem = (topItem.songs = { ...item.item.songs }); // Tạo một tham chiếu mới đến songs của phần tử gốc
    return topSongItem;
  });
  const onPlay = useOnPlay(topSong);

  if (top?.length === 0) {
    return <div className="mt-4 text-neutral-400">No Songs</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
      {top.map((item) => (
        <HotsItems
          key={item?.song_id}
          onClick={(id: string) => {
            onPlay(id);
          }}
          data={item}
        ></HotsItems>
      ))}
    </div>
  );
};

export default PageContentHots;
