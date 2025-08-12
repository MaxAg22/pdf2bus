import { useState } from "react";
import type { HorariosFormateados } from "../interfaces/horario.interface";

export const PrintHorarios = ({
  horarios,
  selectedOption
}: {
  horarios: HorariosFormateados;
  selectedOption: string;
}) => {
  const isIda = selectedOption === "1";

  const getHorarios = (dia: any, idaKey: string, vueltaKey: string) =>
    isIda ? dia[idaKey] : dia[vueltaKey];

  // Estado para cada sección
  const [open, setOpen] = useState({
    lunes: false,
    sabados: false,
    domingos: false
  });

  const toggle = (key: keyof typeof open) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-center text-lg font-bold text-black">Horarios:</h3>
      {horarios ? (
        <ul className="space-y-4">
          {/* Lunes a Viernes */}
          <li>
            <button
              onClick={() => toggle("lunes")}
              className="w-full text-left font-bold text-black flex justify-between"
            >
              Lunes a Viernes
              <span>{open.lunes ? "▲" : "▼"}</span>
            </button>
            {open.lunes && (
              <ul className="ml-4 list-disc list-inside">
                {getHorarios(
                  horarios.lunesViernes,
                  "lunesViernesIda",
                  "lunesViernesVuelta"
                ).map((h, idx) => (
                  <li key={idx} className="text-gray-700">
                    {h.salida} → {h.llegada}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Sábados */}
          <li>
            <button
              onClick={() => toggle("sabados")}
              className="w-full text-left font-bold text-black flex justify-between"
            >
              Sábados
              <span>{open.sabados ? "▲" : "▼"}</span>
            </button>
            {open.sabados && (
              <ul className="ml-4 list-disc list-inside">
                {getHorarios(
                  horarios.sabados,
                  "sabadosIda",
                  "sabadosVuelta"
                ).map((h, idx) => (
                  <li key={idx} className="text-gray-700">
                    {h.salida} → {h.llegada}
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Domingos */}
          <li>
            <button
              onClick={() => toggle("domingos")}
              className="w-full text-left font-bold text-black flex justify-between"
            >
              Domingos y Feriados
              <span>{open.domingos ? "▲" : "▼"}</span>
            </button>
            {open.domingos && (
              <ul className="ml-4 list-disc list-inside">
                {getHorarios(
                  horarios.domingosYFeriados,
                  "DomingosYFeriadosIda",
                  "DomingosYFeriadosVuelta"
                ).map((h, idx) => (
                  <li key={idx} className="text-gray-700">
                    {h.salida} → {h.llegada}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      ) : (
        <p className="text-gray-700">No hay horarios disponibles.</p>
      )}
    </div>
  );
};
