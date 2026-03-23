export interface CurrencyOption {
  value: string;
  label: string;
  searchLabel: string;
}

export const fetchCurrencyOptions = async (): Promise<CurrencyOption[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=currencies,name",
    );

    if (!response.ok) throw new Error("Failed to fetch currencies");

    const data = await response.json();
    const currencyMap: Record<
      string,
      { code: string; name: string; country: string }
    > = {};

    data.forEach((country: any) => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, details]: any) => {
          if (!currencyMap[code]) {
            currencyMap[code] = {
              code,
              name: details.name,
              country: country.name.common,
            };
          }
        });
      }
    });

    return Object.values(currencyMap)
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((item) => ({
        value: item.code,
        label: `${item.code} - ${item.country} (${item.name})`,
        searchLabel: `${item.code} ${item.country} ${item.name}`,
      }));
  } catch (error) {
    console.error("Currency fetch error:", error);
    throw error;
  }
};
