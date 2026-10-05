import { Proceso } from "../Proceso/Proceso";
import { IPlanificador } from "./IPlanificador";
import { IResultadoTick } from "./IResultadoTick";

// Planificador de CPU Round-Robin con quantum configurable
// Tiene la cola de LISTOS (FIFO) y el proceso que está usando la CPU
// S: solo decide quién usa la CPU y cuándo la deja

export class Planificador implements IPlanificador {

    private readonly _quantum: number;
    private _listos: Proceso[] = [];
    private _enCpu: Proceso | undefined = undefined;

    constructor(quantum: number) {
        const quantumValido = Number.isInteger(quantum) && quantum > 0;

        this._quantum = quantumValido ? quantum: this.lanzarErrorQuantum();
    }

    get quantum(): number {
        return this._quantum;
    }
}
