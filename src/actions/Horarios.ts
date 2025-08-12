"use server";
import pdfParse from 'pdf-parse/lib/pdf-parse'
import { HorariosFormateados } from "../interfaces/horario.interface";

const timeRegex = /(?:[01]?\d|2[0-3]):[0-5]\d/g;

export const getHorarios = async (Url: string) => {

    const response = await fetch(Url);

    if (!response.ok) throw new Error("Error al obtener el PDF de horarios");

    const arrayBuffer = await response.arrayBuffer();

    // Obtener el texto del PDF
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);

    // Obtenemos un arreglo con lineas filtradas
    // que empiezan con "La Calera" o "Cordoba"
    const filtrado = await filtrarLineas(data.text);


    // Objetos con { ida , vuelta}
    const lunesViernes = buildlunesViernes(filtrado);
    const sabados = buildSabados(filtrado);
    const domingosYFeriados = buildDomingosYFeriados(filtrado);

    const horarios: HorariosFormateados = {
        lunesViernes: lunesViernes,
        sabados: sabados,
        domingosYFeriados: domingosYFeriados,
    };

    return horarios; // texto extraído completo
};

function filtrarLineas(texto: string): string[] {
  // Separa el texto en líneas
  const lineas = texto.split(/\r?\n/);

  // Filtra las líneas que empiezan con "La Calera" o "Cordoba"
  const resultado = lineas.filter(linea =>
    linea.startsWith("La Calera") || linea.startsWith("Cordoba")
  );
  return resultado;
}

function getTimesFromLine(line: string): string[] {
  if (!line) return [];
  // Normalizar NBSP u otros espacios raros
  const cleaned = line.replace(/\u00A0/g, " ").trim();
  const matches = cleaned.match(timeRegex);
  return matches ?? [];
}

function pairTimes(idaLine: string, vueltaLine: string) {
  const salidas = getTimesFromLine(idaLine);
  const llegadas = getTimesFromLine(vueltaLine);
  const len = Math.min(salidas.length, llegadas.length);
  const pairs: { salida: string; llegada: string }[] = [];
  for (let j = 0; j < len; j++) {
    pairs.push({ salida: salidas[j], llegada: llegadas[j] });
  }
  return pairs;
}

function buildlunesViernes(text: string[]) {
  const lunesViernesIda: { salida: string; llegada: string }[] = [];
  const lunesViernesVuelta: { salida: string; llegada: string }[] = [];

  // Bloque ida lunes-viernes: índices 0..5 (pares 0-1,2-3,4-5)
  for (let i = 0; i <= 5; i += 2) {
    if (!text[i] || !text[i + 1]) continue;
    lunesViernesIda.push(...pairTimes(text[i], text[i + 1]));
  }

  // Bloque vuelta lunes-viernes: índices 6..11
  for (let i = 6; i <= 11; i += 2) {
    if (!text[i] || !text[i + 1]) continue;
    lunesViernesVuelta.push(...pairTimes(text[i], text[i + 1]));
  }

  return { lunesViernesIda, lunesViernesVuelta };
}

function buildSabados(text: string[]) {
  const sabadosIda: { salida: string; llegada: string }[] = [];
  const sabadosVuelta: { salida: string; llegada: string }[] = [];

  // Ida sábados: índices 12..15 (pares 12-13, 14-15 (si aplica))
  for (let i = 12; i <= 15; i += 2) {
    if (!text[i] || !text[i + 1]) continue;
    sabadosIda.push(...pairTimes(text[i], text[i + 1]));
  }

  // Vuelta sábados: índices 16..19
  for (let i = 16; i <= 19; i += 2) {
    if (!text[i] || !text[i + 1]) continue;
    sabadosVuelta.push(...pairTimes(text[i], text[i + 1]));
  }

  return { sabadosIda, sabadosVuelta };
}

function buildDomingosYFeriados(text: string[]) {
  const DomingosYFeriadosIda: { salida: string; llegada: string }[] = [];
  const DomingosYFeriadosVuelta: { salida: string; llegada: string }[] = [];

  // Ida domingos: índices 20..21 (par 20-21)
  if (text[20] && text[21]) {
    DomingosYFeriadosIda.push(...pairTimes(text[20], text[21]));
  }

  // Vuelta domingos: índices 22..23 (par 22-23)
  if (text[22] && text[23]) {
    DomingosYFeriadosVuelta.push(...pairTimes(text[22], text[23]));
  }

  return { DomingosYFeriadosIda, DomingosYFeriadosVuelta };
}
