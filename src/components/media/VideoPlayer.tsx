'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  playLabel?: string;
  pauseLabel?: string;
  muteLabel?: string;
  unmuteLabel?: string;
  className?: string;
}

/**
 * Custom player for showreel or long video (Design System Section 8 & Tech Stack Section 5.3).
 * Never autoplays audio; exposes mono Play/Pause and Mute/Unmute controls.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  playLabel = 'PLAY',
  pauseLabel = 'PAUSE',
  muteLabel = 'MUTE',
  unmuteLabel = 'UNMUTE',
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-card bg-surface', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        playsInline
        preload="none"
        aria-label={title}
        onEnded={() => setIsPlaying(false)}
        className="h-full w-full object-cover"
      />
      <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="text-label-mono inline-flex items-center gap-2 rounded-pill border border-line bg-bg/90 px-4 py-2 text-ink backdrop-blur-sm"
        >
          <Icon name={isPlaying ? 'pause' : 'play_arrow'} size={20} />
          <span>{isPlaying ? pauseLabel : playLabel}</span>
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="text-label-mono inline-flex items-center gap-2 rounded-pill border border-line bg-bg/90 px-4 py-2 text-ink backdrop-blur-sm"
        >
          <Icon name={isMuted ? 'volume_off' : 'volume_up'} size={20} />
          <span>{isMuted ? unmuteLabel : muteLabel}</span>
        </button>
      </div>
    </div>
  );
}
