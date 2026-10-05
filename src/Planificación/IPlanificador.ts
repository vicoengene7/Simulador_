import { Proceso } from "../Proceso/Proceso";
import { IResultadoTick } from "./IResultadoTick";

export interface IPlanificador {
    agregarListo(proceso: Proceso): void;
    ejecutarTick(): IResultadoTick;
    procesoEnCpu(): string | undefined;
    pidsListos(): string[];
}