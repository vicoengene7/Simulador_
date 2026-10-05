import { Proceso } from "../Proceso/Proceso";

export interface IResultadoTick {
    ocupado: boolean;
    terminado?: Proceso;
    rotado?: Proceso;
    bloqueado?: Proceso;
}
