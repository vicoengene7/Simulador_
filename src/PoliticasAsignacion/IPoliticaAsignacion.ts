import { BloqueMemoria } from "../Memoria/BloqueMemoria";

// I de SOLID en POO: la interfaz define únicamente el comportamiento necesario para
// seleccionar un bloque, sin obligar a sus implementaciones
// a utilizar métodos auxiliares que no necesitan.

export interface IPoliticaAsignacion {

    buscarBloque(bloques: BloqueMemoria[], tamanoRequerido: number): BloqueMemoria | undefined;

}