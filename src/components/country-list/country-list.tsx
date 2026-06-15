import { useMemo } from 'react';
import { List } from 'react-virtualized';
import type { ListRowRenderer } from 'react-virtualized';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);

        return matchesSearch && matchesRegion;
      })
      .map((country) => {
        const yearMap = createYearDataMap(country.data);
        const population = getPopulationForYear(yearMap, selectedYear) || 0;

        return {
          country,
          population,
        };
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc'
            ? a.country.id.localeCompare(b.country.id)
            : b.country.id.localeCompare(a.country.id);
        }

        return sortOrder === 'asc' ? a.population - b.population : b.population - a.population;
      })
      .map((item) => item.country);
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    const country = filteredCountries[index];

    if (!country) {
      return null;
    }

    return (
      <div key={key} style={style}>
        <CountryCard
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      </div>
    );
  };

  return (
    <div className={styles.countryList}>
      <List
        width={1160}
        height={295 * 4}
        rowCount={filteredCountries.length}
        rowHeight={295}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};
