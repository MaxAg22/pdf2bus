"use client";
import { useState } from "react";
import { useHorarios } from "../hook/useHorarios";
import { Loader } from "../components/Loader";
import { PrintHorarios } from "@/components/PrintHorarios";

export default function Home() {

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [formatedOption, setFormatedOption] = useState<string>("");

  const { horarios, isLoading, isError } = useHorarios(formatedOption!);

  if (isError) console.error("Error al obtener los horarios:", isError);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = async () => {
    setFormatedOption("https://cotalacalera.com.ar/wp-content/uploads/2025/07/HORARIO-ALBERDI-31-07-2025.pdf");
  };


  return (
    <>
      <div className="flex justify-center items-center min-h-screen">

        <div className="w-[90%] max-w-[600px] bg-white p-5 rounded-lg shadow-lg mx-auto">

          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Horarios de colectivos - Cota</h1>

          <h3 className="text-lg text-gray-600 text-left">Viajes disponibles:</h3>

          <select 
            className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-lg text-black"
            value={selectedOption!}
            onChange={handleSelectChange}
          >
            <option value="" disabled>Seleccione una opción</option>
            <option value="1">La Calera – Córdoba	</option>
            <option value="2">Córdoba – La Calera </option>
          </select>

          <button 
            className="w-full p-2 mt-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleButtonClick}
          >
            Consultar Horarios
          </button>

          {formatedOption && (
            isLoading ? <Loader /> : (
              <PrintHorarios horarios={horarios!} selectedOption={selectedOption} />
            )
          )}
        </div>



      </div>
    </>
  );
}
