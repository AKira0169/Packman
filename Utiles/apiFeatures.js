function paginate(items, page) {
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedItems = items.slice(start, end);
  return paginatedItems;
}

function sortProducts(products) {
  return products.sort((a, b) => {
    const statusComparison = a.status.localeCompare(b.status);

    if (statusComparison === 0) {
      return b.addedAt - a.addedAt;
    }
    return statusComparison;
  });
}

module.exports = {
  paginate,
  sortProducts,
};
