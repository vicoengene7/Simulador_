import {IBloqueMemoria} from "./IBloqueMemoria";

// Representa un bloque contiguo de memoria.

export class BloqueMemoria implements IBloqueMemoria {
    private readonly _inicio: number;
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

    protected setTamano(valor: number): void {
    this._tamano = valor;
    }

    get libre(): boolean {
        return this._libre;
    }

    get pid(): string | null {
        return this._pid;
    }

    // Cambia el estado del bloque de libre a ocupado y registra
    // el PID del proceso al que se le asignó la memoria.

    ocupar(pid: string): void{
        this._libre = false;
        this._pid = pid;
    }

    liberar(): void {
        this._libre = true;
        this._pid = null;
    }

    describir(): string {
    const pid = this._libre ? "LIBRE" : this._pid;
    
    return `[${this._inicio}-${this._inicio + this._tamano} KB] ${pid}`;
    }

    



}