export interface HorariosFormateados {
    lunesViernes: {
        lunesViernesIda: {
            salida: string;
            llegada: string;
        }[];
        lunesViernesVuelta: {
            salida: string;
            llegada: string;
        }[];
    };
    sabados: {
        sabadosIda: {
            salida: string;
            llegada: string;
        }[];
        sabadosVuelta: {
            salida: string;
            llegada: string;
        }[];
    };
    domingosYFeriados: {
        DomingosYFeriadosIda: {
            salida: string;
            llegada: string;
        }[];
        DomingosYFeriadosVuelta: {
            salida: string;
            llegada: string;
        }[];
    };
};

