import { jwtDecode } from "jwt-decode";

/**
 * Função para decodificar um token JWT
 * @param token - O token JWT a ser decodificado
 * @returns O payload do token decodificado
 */
const decodeJWT = <T>(token: string): T | null => {
  try {
    const decoded = jwtDecode<T>(token);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

export default decodeJWT;
