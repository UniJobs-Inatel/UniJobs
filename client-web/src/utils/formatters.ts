/**
 * Format a number to BRL currency
 *
 * @param value number or a string to be formatted
 * @param value number or a string to be formatted
 * @returns string with the formatted value
 */
export function currencyFormatter(value: number | string, currencySign?: boolean): string {
    const locale = 'pt-BR';
    const options: Intl.NumberFormatOptions = {
      style: currencySign == false ? undefined : 'currency',
      currency: currencySign == false ? undefined : 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  
    let numericValue: number;
  
    if (typeof value === 'string') {
      numericValue = parseFloat(value.replace(/\D/g, '')) / 100;
      if (isNaN(numericValue)) {
        numericValue = 0;
      }
    } else {
      numericValue = value ?? 0;
    }
  
    return numericValue.toLocaleString(locale, options);
  }

  /**
 * Remove all non-numeric characters from a string
 *
 * @param value string to be formatted
 * @returns string with only numbers
 */
export function onlyNumbers(value: string): string {
  return value.replace(/\D/g, '');
}