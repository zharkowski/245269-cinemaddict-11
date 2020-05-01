import {FILTERS} from '../consts';
import {getFirstWord} from '../utils/common';

const generateFilters = () => {
  return FILTERS.map(
      (filter) => {
        return {
          title: filter,
          href: getFirstWord(filter.toLowerCase()),
          count: Math.floor(Math.random() * 50),
        };
      }
  );
};

export default generateFilters;
