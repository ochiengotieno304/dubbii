
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getMediaDetails, getSimilarMedia } from '../services/mediaService';
import { MediaDetails, CastMember, Review, MediaType, Genre, MediaItem, Season, Episode } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import MediaGrid from '../components/MediaGrid';
import { ReportInfringementModal } from '../components/ReportInfringementModal'; // Import the new modal
import { DEFAULT_POSTER_PLACEHOLDER, DEFAULT_PROFILE_PLACEHOLDER, DEFAULT_EPISODE_STILL_PLACEHOLDER } from '../constants';

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
        title={`Trailer for ${title}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const CastMemberCard: React.FC<{ member: CastMember }> = ({ member }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const placeholderText = member.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

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

const ReviewCard: React.FC<{ review: Review }> = ({review}) => {
 return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-lg transition-shadow hover:shadow-xl">
        <div className="flex items-center mb-2.5">
        <div className="w-10 h-10 rounded-full bg-secondary text-gray-900 flex items-center justify-center font-bold text-lg mr-3">
            {review.author.substring(0,1).toUpperCase()}
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

const SectionTitle: React.FC<{children: React.ReactNode, className?: string}> = ({children, className = ""}) => (
    <h2 className={`text-2xl md:text-3xl font-bold text-neutral dark:text-gray-100 mb-6 border-l-4 border-secondary pl-4 py-1 ${className}`}>{children}</h2>
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


const SeasonsAndEpisodes: React.FC<{ seasons: Season[] }> = ({ seasons }) => {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(seasons[0]?.seasonNumber || 1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const currentSeason = seasons.find(s => s.seasonNumber === selectedSeasonNumber);

  useEffect(() => {
    // When season changes, select the first episode of the new season by default
    if (currentSeason && currentSeason.episodes.length > 0) {
      setSelectedEpisode(currentSeason.episodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  }, [selectedSeasonNumber, currentSeason]);

  if (!currentSeason) return <p className="text-gray-600 dark:text-gray-400">Season data not available.</p>;

  return (
    <div>
      <div className="flex space-x-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {seasons.map(season => (
          <button
            key={season.id}
            onClick={() => setSelectedSeasonNumber(season.seasonNumber)}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 dark:focus-visible:ring-offset-base-100
              ${selectedSeasonNumber === season.seasonNumber 
                ? 'bg-secondary text-gray-900 shadow' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70 hover:text-secondary dark:hover:text-secondary'
              }`}
          >
            {season.name} ({season.episodeCount} Ep)
          </button>
        ))}
      </div>

      <div className="md:flex md:space-x-6">
        <div className="md:w-1/3 lg:w-1/4 mb-6 md:mb-0 max-h-[500px] overflow-y-auto pr-2 space-y-1.5">
          {currentSeason.episodes.map(episode => (
            <button
              key={episode.id}
              onClick={() => setSelectedEpisode(episode)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ease-in-out
                ${selectedEpisode?.id === episode.id 
                  ? 'bg-gray-100 dark:bg-gray-700 shadow' 
                  : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50'
                }`}
            >
              <p className={`text-xs font-semibold ${selectedEpisode?.id === episode.id ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'}`}>
                E{episode.episodeNumber}
              </p>
              <p className="text-sm text-neutral dark:text-gray-200 line-clamp-1">{episode.title}</p>
            </button>
          ))}
        </div>

        <div className="md:w-2/3 lg:w-3/4">
          {selectedEpisode ? (
            <div className="bg-primary dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-xl">
              <EpisodeStill stillPath={selectedEpisode.stillPath} title={selectedEpisode.title} />
              <h4 className="text-xl font-semibold text-neutral dark:text-gray-100 mt-4 mb-1">
                S{selectedEpisode.seasonNumber} E{selectedEpisode.episodeNumber}: {selectedEpisode.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Air Date: {new Date(selectedEpisode.airDate).toLocaleDateString()}
                {selectedEpisode.voteAverage && selectedEpisode.voteAverage > 0 && (
                    <span className="ml-3">Rating: {selectedEpisode.voteAverage.toFixed(1)}/10</span>
                )}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEpisode.overview}</p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 p-6 text-center">Select an episode to see details.</p>
          )}
        </div>
      </div>
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

  useEffect(() => {
    window.scrollTo(0,0);
    setIsPosterLoaded(false);
    setMediaDetails(null); // Clear previous details
    setSimilarMedia([]); // Clear similar media
    setIsReportModalOpen(false); // Close modal on navigation

    const fetchDetails = async () => {
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
          if (details.type === 'movie') {
            fetchSimilar(details.id, details.type);
          }
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

    fetchDetails();
  }, [id, type]);

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
          className="fixed top-20 left-0 w-full h-[60vh] -z-10 bg-cover bg-center transition-opacity duration-500 ease-in-out opacity-30 dark:opacity-20"
          style={{ backgroundImage: `url(${mediaDetails.backdropPath})` }}
          aria-hidden="true"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-100/30 dark:via-slate-800/30 to-base-100 dark:to-slate-800"></div>
        </div>
      )}
      <div className="relative z-0 pt-8 md:pt-12">
        <div className="md:flex md:space-x-8 lg:space-x-12 mb-10 md:mb-12">
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-6 md:mb-0">
            <div className="relative w-full max-w-xs mx-auto aspect-[2/3] rounded-xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
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
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1.5">{mediaDetails.title} 
              <span className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400 ml-2">({year})</span>
            </h1>
            {mediaDetails.tagline && <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 italic mb-4 md:mb-6">"{mediaDetails.tagline}"</p>}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 md:mb-6">
              <RatingStars rating={mediaDetails.voteAverage} maxRating={10} totalStars={5} size="md" />
              <span className="text-md text-gray-700 dark:text-gray-300">{mediaDetails.voteAverage.toFixed(1)}/10</span>
              {mediaDetails.type === 'movie' && mediaDetails.runtime && <span className="text-gray-600 dark:text-gray-400 text-sm">{mediaDetails.runtime} min</span>}
              {mediaDetails.type === 'tv' && mediaDetails.numberOfSeasons && <span className="text-gray-600 dark:text-gray-400 text-sm">{mediaDetails.numberOfSeasons} Season(s)</span>}
            </div>

            <div className="mb-5 md:mb-6">
              {mediaDetails.genres.map((genre: Genre) => (
                <span key={genre.id} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-3 py-1 rounded-full mr-1.5 mb-1.5 font-medium">{genre.name}</span>
              ))}
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">{mediaDetails.overview}</p>
          </div>
        </div>

        {mediaDetails.trailerKey && (
          <section className="my-10 md:my-12">
            <SectionTitle>Official Trailer</SectionTitle>
            <TrailerEmbed trailerKey={mediaDetails.trailerKey} title={mediaDetails.title} />
          </section>
        )}
        
        {mediaDetails.type === 'tv' && mediaDetails.seasons && mediaDetails.seasons.length > 0 && (
          <section className="my-10 md:my-12">
            <SectionTitle>Seasons & Episodes</SectionTitle>
            <SeasonsAndEpisodes seasons={mediaDetails.seasons} />
          </section>
        )}

        <section className="my-10 md:my-12">
          <SectionTitle>Cast</SectionTitle>
          <CastList cast={mediaDetails.cast} />
        </section>

        <section className="my-10 md:my-12">
          <SectionTitle>User Reviews</SectionTitle>
          <ReviewList reviews={mediaDetails.reviews} />
        </section>
        
        {mediaDetails.type === 'movie' && (
            <section className="my-10 md:my-12">
                <SectionTitle>Similar Movies</SectionTitle>
                {isLoadingSimilar ? (
                     <div className="flex justify-center py-10 min-h-[200px] items-center">
                        <LoadingSpinner size="md" />
                     </div>
                ) : errorSimilar ? (
                    <p className="text-center text-red-500 dark:text-red-400">{errorSimilar}</p>
                ) : similarMedia.length > 0 ? (
                    <MediaGrid items={similarMedia} />
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">No similar movies found.</p>
                )}
            </section>
        )}

        <section className="my-10 md:my-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <SectionTitle>Copyright & DMCA</SectionTitle>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-3">
            <p>dubbii respects the intellectual property rights of others and expects its users to do the same. All content displayed on this site is sourced from third-party providers and is not hosted on our servers.</p>
            <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please use the button below to submit a report. Provide all necessary information for us to investigate your claim.</p>
             <button
                onClick={() => setIsReportModalOpen(true)}
                className="mt-4 px-6 py-2.5 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 dark:hover:bg-blue-700 focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 active:scale-95 transform inline-flex items-center space-x-2"
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
