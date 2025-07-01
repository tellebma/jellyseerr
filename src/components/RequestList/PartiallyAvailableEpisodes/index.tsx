import Badge from '@app/components/Common/Badge';
import { MediaStatus } from '@server/constants/media';
import type { TvDetails } from '@server/models/Tv';
import type Media from '@server/entity/Media';
import { useIntl } from 'react-intl';
import defineMessages from '@app/utils/defineMessages';
import globalMessages from '@app/i18n/globalMessages';

const messages = defineMessages('components.RequestList.PartiallyAvailableEpisodes', {
  partiallyAvailable: 'Partially Available',
  availableContent: 'Some episodes available',
  episodesAvailable: '{count} of {total} episodes available',
});

interface PartiallyAvailableEpisodesProps {
  tvDetails: TvDetails;
  mediaInfo?: Media;
  is4k?: boolean;
}

const PartiallyAvailableEpisodes = ({
  tvDetails,
  mediaInfo,
  is4k = false,
}: PartiallyAvailableEpisodesProps) => {
  const intl = useIntl();

  if (!mediaInfo || !mediaInfo.seasons || mediaInfo.seasons.length === 0) {
    return null;
  }

  // Check if any season is partially available
  const hasPartialSeasons = mediaInfo.seasons.some((mediaSeason) => {
    const status = is4k ? mediaSeason.status4k : mediaSeason.status;
    return status === MediaStatus.PARTIALLY_AVAILABLE;
  });

  if (!hasPartialSeasons) {
    return null;
  }

  // Get all seasons that are partially available
  const partialSeasons = mediaInfo.seasons.filter((mediaSeason) => {
    const status = is4k ? mediaSeason.status4k : mediaSeason.status;
    return status === MediaStatus.PARTIALLY_AVAILABLE;
  });

  return (
    <div className="card-field">
      <span className="card-field-name">
        {intl.formatMessage(messages.partiallyAvailable)}
      </span>
      <div className="flex flex-wrap gap-1">
        {partialSeasons.map((mediaSeason) => {
          const tvSeason = tvDetails.seasons.find(
            (s) => s.seasonNumber === mediaSeason.seasonNumber
          );
          
          return (
            <div key={`partial-season-${mediaSeason.seasonNumber}`} className="flex items-center space-x-1">
              <Badge badgeType="warning">
                {mediaSeason.seasonNumber === 0
                  ? intl.formatMessage(globalMessages.specials)
                  : `S${mediaSeason.seasonNumber}`}
              </Badge>
              {tvSeason && (
                <span className="text-xs text-gray-400">
                  ({tvSeason.episodeCount} eps)
                </span>
              )}
            </div>
          );
        })}
        <span className="text-xs text-gray-400 self-center ml-2">
          {intl.formatMessage(messages.availableContent)}
        </span>
      </div>
    </div>
  );
};

export default PartiallyAvailableEpisodes;