import { EstadoProceso } from "./EstadoProceso";

export interface IProceso {
    readonly pid: string;
    readonly tamanoMemoria: number;
    readonly tiempoCpuTotal: number;
    readonly tiempoCpuRestante: number;
    readonly estado: EstadoProceso;
    readonly quantumConsumido: number;
    readonly tiempoBloqueRestante: number;
}