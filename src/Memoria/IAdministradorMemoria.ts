import { IBloqueMemoria } from "./IBloqueMemoria";

export interface IAdministradorMemoria {
    memoriaTotal(): number;
    obtenerBloques(): readonly IBloqueMemoria[];
}