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

    agregarListo(proceso: Proceso): void {
        this._listos.push(proceso);
    }

    ejecutarTick(): IResultadoTick {
        this.despachar();

        const actual = this._enCpu;

        return actual === undefined ? { ocupado: false } : this.ejecutarProceso(actual);
    }

    private ejecutarProceso(actual: Proceso): IResultadoTick {
        actual.ejecutarUnTick();

        return actual.estaTerminado() ? this.resolverFinalizacion(actual): actual.debeBloquearse() ? this.resolverBloqueo(actual) : actual.quantumConsumido >= this._quantum ? this.resolverQuantumAgotado(actual) : { ocupado: true };
    }

    private resolverFinalizacion(actual: Proceso): IResultadoTick {
        actual.terminar();
        this._enCpu = undefined;

        return {ocupado: true,terminado: actual
        };
    }

    private resolverBloqueo(actual: Proceso): IResultadoTick {
        actual.bloquear();
        this._enCpu = undefined;

        return {ocupado: true, bloqueado: actual};
    }

    private resolverQuantumAgotado(actual: Proceso): IResultadoTick {
        return this._listos.length === 0 ? this.renovarQuantum(actual) : this.rotarProceso(actual);
    }

    private renovarQuantum(actual: Proceso): IResultadoTick {
        actual.reiniciarQuantum();

        return {ocupado: true};
    }

    private rotarProceso(actual: Proceso): IResultadoTick {
        actual.volverAListo();
        this._listos.push(actual);
        this._enCpu = undefined;

        return {ocupado: true,rotado: actual};
    }

    private despachar(): void {
        const siguiente = this._enCpu === undefined ? this._listos.shift() : undefined;

        siguiente === undefined ? undefined : this.asignarCpu(siguiente);
    }

    private asignarCpu(proceso: Proceso): void {
        proceso.ejecutar();
        this._enCpu = proceso;
    }

    private lanzarErrorQuantum(): never {
        throw new Error("El quantum debe ser un entero positivo");
    }

    procesoEnCpu(): string | undefined {
        return this._enCpu?.pid;
    }

    pidsListos(): string[] {
        return this._listos.map(proceso => proceso.pid);
    }

}
