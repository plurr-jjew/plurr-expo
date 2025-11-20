export const getTimeDifference = (pastDate: string, isAbbreviated: boolean) => {
  const now = new Date().getTime();
  const past = new Date(pastDate).getTime();

  // Calculate difference in milliseconds
  const diffMs = now - past;

  // Convert to minutes, hours, and days
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Return appropriate format
  if (isAbbreviated) {
    if (diffMinutes < 60) {
      return `${diffMinutes} m ago`;
    } else if (diffHours < 24) {
      return `${diffHours} h ago`;
    } else {
      return `${diffDays} d ago`;
    }
  } else {
    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  }
};
