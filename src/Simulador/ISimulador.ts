import { IMetricas } from "../Memoria/IMetricas";
import { Proceso } from "../Proceso/Proceso";

// Contrato público del simulador: órdenes (agregar proceso, avanzar tick) y consultas del estado.
export interface ISimulador {
    agregarProceso(proceso: Proceso): void;
    avanzarTick(): void;
    tickActual(): number;
    usoCpu(): number;
    cambiosDeContexto(): number;
    procesoEnCpu(): string | undefined;
    metricasMemoria(): IMetricas;
    mapaMemoria(): string[];
    estados(): string[];
    pidsListos(): string[];
    pidsEsperandoMemoria(): string[];
    pidsBloqueados(): string[];
    pidsTerminados(): string[];
}
