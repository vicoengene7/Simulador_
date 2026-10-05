import { IBloqueMemoria } from "./IBloqueMemoria";
import { IMetricas } from "./IMetricas";

export interface IAdministradorMemoria {
    obtenerMemoriaTotal(): number;
    obtenerBloques(): readonly IBloqueMemoria[];
    metricas(): IMetricas;
    mapa(): string[];
}