import {IBloqueMemoria} from "./IBloqueMemoria";

// Representa un bloque contiguo de memoria.

export class BloqueMemoria implements IBloqueMemoria {
    private _inicio: number;
    private _tamano: number;
    private _libre: boolean;
    private _pid: string | null;

    constructor(inicio: number, tamano: number) {
        this._inicio = inicio;
        this._tamano = tamano;
        this._libre = true;
        this._pid = null;
    }

    get inicio(): number {
        return this._inicio;
    }

    get tamano(): number {
        return this._tamano;
    }

    get libre(): boolean {
        return this._libre;
    }

    get pid(): string | null {
        return this._pid;
    }

    ocupar(pid: string): void{
        this._libre = false;
        this._pid = pid;
    }
    // Cambia el estado del bloque de libre a ocupado y registra
    // el PID del proceso al que se le asignó la memoria.


}