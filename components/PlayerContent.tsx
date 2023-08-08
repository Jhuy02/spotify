"use client";

import { Song } from "@/types";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";

import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useSound from "use-sound";

import usePlayer from "@/hooks/usePlayer";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    setSongDuration(duration! / 1000);
  }, [duration]);

  useEffect(() => {
    sound?.play();
    const updateCurrentTime = () => {
      setCurrentTime(sound?.seek() || 0);
    };
    const interval = setInterval(updateCurrentTime, 500);

    return () => {
      sound?.unload();
      clearInterval(interval);
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex gap-x-4 items-center">
          <MediaItem data={song}></MediaItem>
          <LikeButton songId={song.id}></LikeButton>
        </div>
      </div>
      <div className="flex  md:hidden col-auto w-full justify-end items-center">
        <div
          onClick={handlePlay}
          className="h-10w-10flex items-center justify-center rounded-full  bg-white p-1 cursor-pointe"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>
      <div className="hidden h-full md:flex md:flex-col justify-center items-center w-full max-w-[722px] gap-x-6">
        <div className="flex items-center justify-center gap-x-6 pb-2">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />

          <div
            onClick={handlePlay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>

          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div className="flex items-center justify-center gap-x-2 w-[500px]">
          <p className="text-neutral-400 flex items-center justify-center">
            {Math.floor(currentTime / 60)} : {Math.floor(currentTime % 60)}
          </p>
          <input
            type="range"
            min="0"
            max={songDuration}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              sound?.seek(newTime);
              setCurrentTime(newTime);
            }}
            step={0.1}
            className="appearance-none w-[400px] h-1 bg-[#d3d3d3] outline-none ease-out transition"
            id="progress"
          />
          <p className="text-neutral-400 text-sm font-medium flex items-center justify-center">
            {Math.floor(songDuration / 60)} : {Math.floor(songDuration % 60)}
          </p>
        </div>
      </div>
      <div className="hidden md:flex justify-end w-full pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={30}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
