const getPageInfo = (totalCount, first = 0, skip = 0) => {
  const hasNextPage = first + skip < totalCount ? true : false;
  const hasPreviousPage = skip === 0 && totalCount > first ? false : true;
  return {
    hasNextPage,
    hasPreviousPage
  };
};

export {getPageInfo};
