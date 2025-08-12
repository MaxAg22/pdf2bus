import { useQuery } from '@tanstack/react-query';
import { getHorarios } from "../actions/index";

export const useHorarios = (option: string) => {
	const {
		data: horarios,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['horarios', option],
		queryFn: () => getHorarios(option),
		retry: false,
		enabled: !!option, // Solo ejecutar la consulta si option no es vacío
		refetchOnWindowFocus: false,
	});

	return {
		horarios,
		isError,
		isLoading,
	};
};