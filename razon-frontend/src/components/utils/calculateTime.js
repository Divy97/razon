export const calculateTime = (timestampStr) => {
  const givenTimestamp = new Date(timestampStr);
  const currentDate = new Date();
  const timeDifference = currentDate - givenTimestamp;

  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hoursDifference >= 24) {
    const daysDifference = Math.floor(hoursDifference / 24);
    return `${daysDifference} days ago`;
  } else {
    return `${hoursDifference} hours ago`;
  }
};
