import PropTypes from 'prop-types';

export default function TransactionFilters({
  filters,
  setFilters,
  categories,
}) {
  const dateRanges = [
    'Last 7 days',
    'Last 30 days',
    'This month',
    'Last month',
    'This year',
  ];
  const transactionTypes = ['Income', 'Expense'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        className="w-full p-2 border rounded-lg"
        value={filters.dateRange}
        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
      >
        {dateRanges.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 border rounded-lg"
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="All Categories">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 border rounded-lg"
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <option value="All Types">All Types</option>
        {transactionTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        className="w-full p-2 border rounded-lg"
        value={filters.sort}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        <option value="Date (Newest)">Date (Newest)</option>
        <option value="Date (Oldest)">Date (Oldest)</option>
        <option value="Amount (High to Low)">Amount (High to Low)</option>
        <option value="Amount (Low to High)">Amount (Low to High)</option>
      </select>
    </div>
  );
}

TransactionFilters.propTypes = {
  filters: PropTypes.shape({
    dateRange: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};
