import { useContext } from 'react';
import { CountryContext } from '../CountryContext';

export const useCountry = () => useContext(CountryContext)