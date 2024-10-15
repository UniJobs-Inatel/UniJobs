import { z } from "zod";

/**
 * Validates a CPF number. Built to use with Zod.
 *
 * @param cpf CPF number to be validated
 * @returns true if the CPF is valid, false otherwise
 */
export const cpfValidator = (cpf: string): boolean => {
    if (cpf.length == 0) return false;
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]+/g, '');
  
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
    const cpfDigits = cpf.split('').map((el) => +el);
  
    const rest = (count: number): number => {
      return (
        ((cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) *
          10) %
          11) %
        10
      );
    };
  
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
  };


  /**
 * Define a default required message to a zod type.
 *
 * @param message default message to string
 */
export const requiredString = (message: string = 'Campo obrigatório') => z.string().min(1, { message });

/**
* Define a default required message to a zod type.
*
* @param message default message to number
*/
export const requiredNumber = (message: string = 'Campo obrigatório') => z.number({ invalid_type_error: message });


/**
* Validate string date in dd/mm/yyyy format.
*
* @param dateString date in string format.
*/
export const isValidDate = (dateString: string) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/**
 * Validates a CNPJ number. Built to use with Zod.
 *
 * @param cnpj CNPJ number to be validated
 * @returns true if the CNPJ is valid, false otherwise
 */
export const cnpjValidator = (cnpj: string): boolean => {
      cnpj = cnpj.replace(/[^\d]+/g, '');

      
      console.log(cnpj.length !== 14)
      console.log(/^(\d)\1+$/.test(cnpj))
      if (cnpj.length !== 14) return false;
  
      if (/^(\d)\1+$/.test(cnpj)) return false;
  
      let size = cnpj.length - 2;
      let numbers = cnpj.substring(0, size);
      const digits = cnpj.substring(size);
      let sum = 0;
      let pos = size - 7;
  
      for (let i = size; i >= 1; i--) {
          sum += +numbers.charAt(size - i) * pos--;
          if (pos < 2) pos = 9;
      }
  
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

      
  
      if (result != +digits.charAt(0)) return false;
  
      size++;
      numbers = cnpj.substring(0, size);
      sum = 0;
      pos = size - 7;
  
      for (let i = size; i >= 1; i--) {
          sum += +numbers.charAt(size - i) * pos--;
          if (pos < 2) pos = 9;
      }
  
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

      
  
      return result == +digits.charAt(1);
};