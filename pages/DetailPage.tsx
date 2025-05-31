import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getMediaDetails, getSimilarMedia } from '../services/mediaService';
import { MediaDetails, CastMember, Review, MediaType, Genre, MediaItem, Season, Episode } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import MediaGrid from '../components/MediaGrid';
import { ReportInfringementModal } from '../components/ReportInfringementModal';
import { DEFAULT_POSTER_PLACEHOLDER, DEFAULT_PROFILE_PLACEHOLDER, DEFAULT_EPISODE_STILL_PLACEHOLDER } from '../constants';
import { useWatchLater } from '../contexts/WatchLaterContext';

const VideoPlayer: React.FC<{ src: string | null; title: string | null }> = ({ src, title }) => {
  if (!src) {
    return (
      <div className="aspect-video w-full bg-primary dark:bg-gray-800/50 rounded-xl shadow-xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
            {title ? `Player for ${title} will appear here.` : 'Select an episode to play or player not available.'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            (Ensure you have a stable internet connection and no ad-blockers interfering)
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-video overflow-hidden rounded-xl shadow-2xl bg-black border border-gray-700 dark:border-gray-600">
      <iframe
        width="100%"
        height="100%"
        src={src}
        title={title || 'Video Player'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="transition-opacity duration-300 ease-in-out"
        onLoad={(e) => (e.target as HTMLIFrameElement).style.opacity = '1'}
        style={{ opacity: 0 }}
      ></iframe>
    </div>
  );
};


const TrailerEmbed: React.FC<{ trailerKey?: string, title: string }> = ({ trailerKey, title }) => {
  if (!trailerKey) {
    return <p className="text-gray-600 dark:text-gray-400">No trailer available for this title.</p>;
  }
  return (
    <div className="aspect-video overflow-hidden rounded-xl shadow-xl">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${trailerKey}`}
        title={`Trailer for ${title} - dubbii`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="transition-opacity duration-300 ease-in-out"
        onLoad={(e) => (e.target as HTMLIFrameElement).style.opacity = '1'}
        style={{ opacity: 0 }}
      ></iframe>
    </div>
  );
};

const CastMemberCard: React.FC<{ member: CastMember }> = ({ member }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const placeholderText = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  useEffect(() => {
    setIsImageLoaded(false);
  }, [member.id]);

  return (
    <div className="text-center group">
      <div className="relative w-full max-w-[150px] mx-auto aspect-[2/3] rounded-xl shadow-lg mb-2 overflow-hidden bg-gray-200 dark:bg-gray-700 transform group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
        {!isImageLoaded && (
          <div className="absolute inset-0 w-full h-full animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl font-bold">
            {placeholderText}
          </div>
        )}
        <img
          src={member.profilePath || DEFAULT_PROFILE_PLACEHOLDER}
          alt={member.name}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROFILE_PLACEHOLDER; setIsImageLoaded(true); }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <p className="font-semibold text-neutral dark:text-gray-100 text-sm line-clamp-1">{member.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{member.character}</p>
    </div>
  );
};


const CastList: React.FC<{ cast: CastMember[] }> = ({ cast }) => {
  if (!cast || cast.length === 0) return <p className="text-gray-600 dark:text-gray-400">Cast information not available.</p>;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
      {cast.slice(0, 12).map(member => (
        <CastMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-lg transition-shadow hover:shadow-xl">
      <div className="flex items-center mb-2.5">
        <div className="w-10 h-10 rounded-full bg-secondary text-gray-900 flex items-center justify-center font-bold text-lg mr-3">
          {review.author.substring(0, 1).toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-neutral dark:text-gray-100">{review.author}</h4>
          {review.rating && <RatingStars rating={review.rating} maxRating={10} totalStars={5} size="sm" />}
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{review.content}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-right">
        Posted: {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return <p className="text-gray-600 dark:text-gray-400">No reviews yet for this title.</p>;
  return (
    <div className="space-y-6">
      {reviews.slice(0, 5).map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode, className?: string, icon?: React.ReactNode }> = ({ children, className = "", icon }) => (
  <div className={`flex items-center mb-6 ${className}`}>
    {icon && <span className="mr-3 text-secondary">{icon}</span>}
    <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 border-l-4 border-secondary pl-3 sm:pl-4 py-1`}>{children}</h2>
  </div>
);

const EpisodeStill: React.FC<{ stillPath?: string; title: string }> = ({ stillPath, title }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  useEffect(() => { setIsImageLoaded(false); }, [stillPath]);

  return (
    <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg">
      {!isImageLoaded && (
        <div className="absolute inset-0 animate-pulse flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
      )}
      <img
        src={stillPath || DEFAULT_EPISODE_STILL_PLACEHOLDER}
        alt={`Still from ${title}`}
        onLoad={() => setIsImageLoaded(true)}
        onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_EPISODE_STILL_PLACEHOLDER; setIsImageLoaded(true); }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const SeasonsAndEpisodes: React.FC<{
  seasons: Season[];
  tvShowId: string;
  mediaTitle: string;
}> = ({ seasons, tvShowId, mediaTitle }) => {

  const getInitialSeasonNumber = useCallback(() => {
    const sortedNumberedSeasons = seasons.filter(s => s.seasonNumber > 0).sort((a, b) => a.seasonNumber - b.seasonNumber);
    const allSortedSeasons = [...seasons].sort((a, b) => a.seasonNumber - b.seasonNumber);
    return sortedNumberedSeasons.length > 0 ? sortedNumberedSeasons[0].seasonNumber :
      (allSortedSeasons.length > 0 ? allSortedSeasons[0].seasonNumber : 1);
  }, [seasons]);

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(getInitialSeasonNumber());
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodePlayerUrl, setEpisodePlayerUrl] = useState<string | null>(null);
  const [episodePlayerTitle, setEpisodePlayerTitle] = useState<string | null>(null);

  const currentSeason = seasons.find(s => s.seasonNumber === selectedSeasonNumber);

  useEffect(() => {
    const seasonExists = seasons.some(s => s.seasonNumber === selectedSeasonNumber);
    if (!seasonExists && seasons.length > 0) {
      setSelectedSeasonNumber(getInitialSeasonNumber());
    }
  }, [seasons, selectedSeasonNumber, getInitialSeasonNumber]);

  useEffect(() => {
    if (currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0) {
      const sortedEpisodes = [...currentSeason.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);
      setSelectedEpisode(sortedEpisodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  }, [selectedSeasonNumber, currentSeason]);

  useEffect(() => {
    if (selectedEpisode && tvShowId) {
      setEpisodePlayerUrl(`https://multiembed.mov/directstream.php?video_id=${tvShowId}&tmdb=1&s=${selectedEpisode.seasonNumber}&e=${selectedEpisode.episodeNumber}`);
      setEpisodePlayerTitle(`${mediaTitle} S${selectedEpisode.seasonNumber} E${selectedEpisode.episodeNumber}: ${selectedEpisode.title}`);
    } else {
      setEpisodePlayerUrl(null);
      setEpisodePlayerTitle(mediaTitle || "TV Show Episode");
    }
  }, [selectedEpisode, tvShowId, mediaTitle]);


  if (seasons.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400 p-4 text-center">Season data not available for this show.</p>;
  }

  const allSortedSeasons = [...seasons].sort((a, b) => a.seasonNumber - b.seasonNumber);

  return (
    <div>
      <div className="flex space-x-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto custom-scrollbar" role="tablist" aria-label="TV Seasons">
        {allSortedSeasons.map(season => (
          <button
            key={season.id}
            onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
            role="tab"
            aria-selected={selectedSeasonNumber === season.seasonNumber}
            aria-controls={`season-content-${season.seasonNumber}`}
            id={`season-tab-${season.seasonNumber}`}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-t-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-base-100
              ${selectedSeasonNumber === season.seasonNumber
                ? 'bg-secondary text-gray-900 shadow'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:text-secondary dark:hover:text-secondary'
              }`}
          >
            {season.name || `Season ${season.seasonNumber}`} {season.episodeCount > 0 ? `(${season.episodeCount} Ep)` : ''}
          </button>
        ))}
      </div>

      {currentSeason ? (
        <div
          id={`season-content-${currentSeason.seasonNumber}`}
          role="tabpanel"
          aria-labelledby={`season-tab-${currentSeason.seasonNumber}`}
          className="md:flex md:space-x-6"
        >
          <div className="md:w-1/3 lg:w-1/4 mb-6 md:mb-0 max-h-[300px] sm:max-h-[400px] md:max-h-[calc(var(--player-aspect-ratio,0.5625)*80vh+100px)] lg:max-h-[calc(var(--player-aspect-ratio,0.5625)*70vh+100px)] overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
            {currentSeason.episodes && currentSeason.episodes.length > 0 ? (
              currentSeason.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber).map(episode => (
                <button
                  key={episode.id}
                  onClick={() => setSelectedEpisode(episode)}
                  aria-current={selectedEpisode?.id === episode.id ? "true" : undefined}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-colors duration-150 ease-in-out block focus:outline-none focus-visible:ring-1 focus-visible:ring-accent
                    ${selectedEpisode?.id === episode.id
                      ? 'bg-gray-100 dark:bg-gray-700 shadow-md ring-1 ring-inset ring-secondary'
                      : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50'
                    }`}
                >
                  <p className={`text-xs font-semibold ${selectedEpisode?.id === episode.id ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'}`}>
                    Episode {episode.episodeNumber}
                  </p>
                  <p className="text-sm text-neutral dark:text-gray-200 line-clamp-1">{episode.title}</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 p-3 text-sm">No episodes listed for this season.</p>
            )}
          </div>

          <div className="md:w-2/3 lg:w-3/4">
            <VideoPlayer src={episodePlayerUrl} title={episodePlayerTitle} />
            {selectedEpisode ? (
              <div className="bg-primary dark:bg-gray-800 p-4 md:p-6 rounded-b-xl shadow-xl mt-0">
                <h4 className="text-lg sm:text-xl font-semibold text-neutral dark:text-gray-100 mt-0 mb-1">
                  S{selectedEpisode.seasonNumber} E{selectedEpisode.episodeNumber}: {selectedEpisode.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Air Date: {selectedEpisode.airDate ? new Date(selectedEpisode.airDate).toLocaleDateString() : 'N/A'}
                  {selectedEpisode.voteAverage && selectedEpisode.voteAverage > 0 && (
                    <span className="ml-3">Rating: {selectedEpisode.voteAverage.toFixed(1)}/10</span>
                  )}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEpisode.overview}</p>
              </div>
            ) : (
              <div className="bg-primary dark:bg-gray-800 p-6 rounded-b-xl shadow-xl mt-0 flex items-center justify-center min-h-[150px]">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {currentSeason.episodes && currentSeason.episodes.length > 0 ? "Select an episode to see details." : "No episodes available for this season."}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 p-6 text-center">Select a season to view episodes.</p>
      )}
    </div>
  );
};


const DetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: MediaType | string, id: string }>();
  const location = useLocation();
  const [mediaDetails, setMediaDetails] = useState<MediaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  const [similarMedia, setSimilarMedia] = useState<MediaItem[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [errorSimilar, setErrorSimilar] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [playerEmbedUrl, setPlayerEmbedUrl] = useState<string | null>(null);
  const [playerEmbedTitle, setPlayerEmbedTitle] = useState<string | null>(null);

  const { watchLaterItems, addToWatchLater, removeFromWatchLater } = useWatchLater();
  const [isInWatchLater, setIsInWatchLater] = useState(false);


  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPosterLoaded(false);
    setMediaDetails(null);
    setSimilarMedia([]);
    setIsReportModalOpen(false);
    setPlayerEmbedUrl(null);
    setPlayerEmbedTitle(null);


    const fetchDetailsAndSimilar = async () => {
      if (!id || (type !== 'movie' && type !== 'tv')) {
        setError('Invalid media ID or type specified.');
        setMediaDetails(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const details = await getMediaDetails(id, type as MediaType);
        if (details) {
          setMediaDetails(details);
          // Check watch later status after details are fetched
          setIsInWatchLater(watchLaterItems.some(item => item.id === details.id && item.type === details.type));

          if (details.type === 'movie') {
            setPlayerEmbedUrl(`https://multiembed.mov/directstream.php?video_id=${details.id}&tmdb=1`);
            setPlayerEmbedTitle(details.title);
          } else if (details.type === 'tv' && details.seasons && details.seasons.length > 0) {
            // For TV shows, initial player URL set in SeasonsAndEpisodes component
            // based on first season/episode.
            // Here we just ensure playerEmbedTitle has a fallback.
            setPlayerEmbedTitle(details.title);
          }


          fetchSimilar(details.id, details.type);
        } else {
          setError('Media not found.');
        }
      } catch (err) {
        console.error('Failed to fetch media details:', err);
        setError('Could not load details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSimilar = async (mediaId: string, mediaType: MediaType) => {
      setIsLoadingSimilar(true);
      setErrorSimilar(null);
      try {
        const similarItems = await getSimilarMedia(mediaId, mediaType);
        setSimilarMedia(similarItems);
      } catch (err) {
        console.error('Failed to fetch similar media:', err);
        setErrorSimilar('Could not load similar content.');
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    fetchDetailsAndSimilar();
  }, [id, type, watchLaterItems]); // Added watchLaterItems dependency for isInWatchLater updates


  const handleToggleWatchLater = () => {
    if (!mediaDetails) return;
    if (isInWatchLater) {
      removeFromWatchLater(mediaDetails.id, mediaDetails.type);
    } else {
      addToWatchLater(mediaDetails as MediaItem); // Cast as MediaItem as WatchLaterContext expects MediaItem
    }
    setIsInWatchLater(!isInWatchLater); // Toggle local state immediately
  };


  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size="lg" /></div>;
  }

  if (error || !mediaDetails) {
    return (
      <div className="text-center py-10 md:py-20 px-4">
        <p className="text-xl text-red-500 dark:text-red-400 mb-6">{error || 'Media details not available.'}</p>
        <Link
          to="/"
          className="px-6 py-3 bg-secondary text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors duration-300 text-lg"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  const year = mediaDetails.releaseDate ? new Date(mediaDetails.releaseDate).getFullYear() : 'N/A';
  const currentContentUrl = `${window.location.origin}${window.location.pathname}#${location.pathname}${location.search}`;


  return (
    <div className="container mx-auto px-4 py-8 text-neutral dark:text-gray-200">
      {mediaDetails.backdropPath && (
        <div
          className="fixed top-20 left-0 w-full h-[40vh] sm:h-[50vh] md:h-[60vh] -z-10 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-30 dark:opacity-20"
          style={{ backgroundImage: `url(${mediaDetails.backdropPath})` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-100/30 dark:via-slate-800/30 to-base-100 dark:to-slate-800"></div>
        </div>
      )}
      <div className="relative z-0 pt-4 sm:pt-8 md:pt-12">
        <div className="md:flex md:space-x-6 lg:space-x-8 xl:space-x-12 mb-8 md:mb-12">
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-6 md:mb-0 mx-auto md:mx-0 w-2/3 sm:w-1/2 max-w-[280px] md:max-w-xs">
            <div className="relative w-full aspect-[2/3] rounded-xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              {!isPosterLoaded && (
                <div className="absolute inset-0 w-full h-full animate-pulse flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              )}
              <img
                src={mediaDetails.posterPath || DEFAULT_POSTER_PLACEHOLDER}
                alt={`Poster for ${mediaDetails.title}`}
                onLoad={() => setIsPosterLoaded(true)}
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER_PLACEHOLDER; setIsPosterLoaded(true); }}
                className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isPosterLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>
          <div className="md:w-2/3 lg:w-3/4 mt-6 md:mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-1.5">{mediaDetails.title}
              <span className="text-xl sm:text-2xl md:text-3xl text-gray-500 dark:text-gray-400 ml-2">({year})</span>
            </h1>
            {mediaDetails.tagline && <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 italic mb-3 sm:mb-4 md:mb-6">"{mediaDetails.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 mb-3 sm:mb-4 md:mb-6">
              <RatingStars rating={mediaDetails.voteAverage} maxRating={10} totalStars={5} size="md" />
              <span className="text-sm sm:text-md text-gray-700 dark:text-gray-300">{mediaDetails.voteAverage.toFixed(1)}/10</span>
              {mediaDetails.type === 'movie' && mediaDetails.runtime && <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{mediaDetails.runtime} min</span>}
              {mediaDetails.type === 'tv' && mediaDetails.numberOfSeasons && <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{mediaDetails.numberOfSeasons} Season(s)</span>}
            </div>

            <div className="mb-3 md:mb-4">
              {mediaDetails.genres.map((genre: Genre) => (
                <span key={genre.id} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-2.5 py-1 sm:px-3 rounded-full mr-1.5 mb-1.5 font-medium">{genre.name}</span>
              ))}
            </div>

            <button
              onClick={handleToggleWatchLater}
              aria-pressed={isInWatchLater}
              aria-label={isInWatchLater ? "Remove this item from your watch list" : "Add this item to your watch list"}
              className={`inline-flex items-center justify-center px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:scale-95 transform mb-4 sm:mb-5 md:mb-6
                ${isInWatchLater
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-secondary text-gray-900 hover:bg-amber-400'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                ${isInWatchLater ? 'focus:ring-gray-400' : 'focus:ring-amber-500'}
              `}
            >
              <span>{isInWatchLater ? 'On Watch List' : 'Save to Watch List'}</span>
            </button>

            <div className="mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-0 mb-2">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{mediaDetails.overview}</p>
            </div>
          </div>
        </div>

        {mediaDetails.type === 'movie' && (
          <section className="my-8 md:my-12">
            <SectionTitle>Watch Now</SectionTitle>
            <VideoPlayer src={playerEmbedUrl} title={playerEmbedTitle} />
          </section>
        )}

        {mediaDetails.trailerKey && (
          <section className="my-8 md:my-12">
            <SectionTitle>Official Trailer</SectionTitle>
            <TrailerEmbed trailerKey={mediaDetails.trailerKey} title={mediaDetails.title} />
          </section>
        )}

        {mediaDetails.type === 'tv' && mediaDetails.seasons && mediaDetails.seasons.length > 0 && mediaDetails.id && (
          <section className="my-8 md:my-12">
            <SectionTitle>Seasons & Episodes</SectionTitle>
            <SeasonsAndEpisodes
              seasons={mediaDetails.seasons}
              tvShowId={mediaDetails.id}
              mediaTitle={mediaDetails.title}
            />
          </section>
        )}

        <section className="my-8 md:my-12">
          <SectionTitle>Cast</SectionTitle>
          <CastList cast={mediaDetails.cast} />
        </section>

        <section className="my-8 md:my-12">
          <SectionTitle>User Reviews</SectionTitle>
          <ReviewList reviews={mediaDetails.reviews} />
        </section>

        {similarMedia.length > 0 && (
          <section className="my-8 md:my-12">
            <SectionTitle>Similar {mediaDetails.type === 'movie' ? 'Movies' : 'TV Shows'}</SectionTitle>
            {isLoadingSimilar ? (
              <div className="flex justify-center py-10 min-h-[200px] items-center">
                <LoadingSpinner size="md" />
              </div>
            ) : errorSimilar ? (
              <p className="text-center text-red-500 dark:text-red-400">{errorSimilar}</p>
            ) : (
              <MediaGrid items={similarMedia} />
            )}
          </section>
        )}


        <section className="my-8 md:my-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <SectionTitle>Copyright & DMCA</SectionTitle>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-3">
            <p>dubbii respects the intellectual property rights of others and expects its users to do the same. All content displayed on this site is sourced from third-party providers and is not hosted on our servers.</p>
            <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please use the button below to submit a report. Provide all necessary information for us to investigate your claim.</p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-4 px-5 py-2 sm:px-6 sm:py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 dark:hover:bg-red-700 focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-red-500 transition-all duration-200 active:scale-95 transform inline-flex items-center space-x-2 text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
              <span>Report Infringement</span>
            </button>
            <p className="text-xs mt-2">Upon receiving a valid DMCA notice through our reporting form, we will take whatever action, in our sole discretion, we deem appropriate, including removal of the challenged content from the site if verified.</p>
          </div>
        </section>
      </div>
      {isReportModalOpen && mediaDetails && (
        <ReportInfringementModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          defaultContentUrl={currentContentUrl}
          contentTitle={mediaDetails.title}
        />
      )}
    </div>
  );
};

export default DetailPage;