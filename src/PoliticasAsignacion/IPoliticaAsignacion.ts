import { BloqueMemoria } from "../Memoria/BloqueMemoria";

export interface IPoliticaAsignacion {

    buscarBloque(bloques: BloqueMemoria[], tamanoRequerido: number): BloqueMemoria | undefined;

}