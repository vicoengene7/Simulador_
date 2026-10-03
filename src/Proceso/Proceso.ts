import { EstadoProceso } from "./EstadoProceso";
import { IProceso } from "./IProceso";

export class Proceso implements IProceso {
    private readonly _pid: string;
    private readonly _tamanoMemoria: number;
    private readonly _tiempoCpuTotal: number;
    private _tiempoCpuRestante: number;
    private _estado: EstadoProceso;
    private _quantumConsumido: number;
    private _tiempoBloqueoRestante:number;

    constructor(pid: string, tamanoMemoria: number, tiempoCpuTotal: number ){
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = EstadoProceso.NUEVO;
        this._quantumConsumido = 0;
        this._tiempoBloqueoRestante = 0;

    }
    
    ejecutarUnTick(): void {
    const nuevoTiempoCpu = this._tiempoCpuRestante - 1;
    const nuevoQuantum = this._quantumConsumido + 1;

    this.setTiempoCpuRestante(nuevoTiempoCpu);
    this.setQuantumConsumido(nuevoQuantum);
    }

    estaTerminado(): boolean {
        return this._tiempoCpuRestante === 0;
    }

    get pid(): string{
        return this._pid;
    }

    get tamanoMemoria(): number{
        return this._tamanoMemoria;
    }

    get tiempoCpuTotal(): number{
        return this._tiempoCpuTotal;
    }

    get tiempoCpuRestante():number{
        return this._tiempoCpuRestante;
    }

    protected setTiempoCpuRestante(valor: number): void {
    this._tiempoCpuRestante = valor;
    }

    get estado(): EstadoProceso{
        return this._estado;
    }

    protected setEstado(valor: EstadoProceso): void {
        this._estado = valor;
    }

    
    get quantumConsumido(): number{
        return this._quantumConsumido
    }

    protected setQuantumConsumido(valor: number): void {
        this._quantumConsumido = valor;
    }

    get tiempoBloqueoRestante(): number{
        return this._tiempoBloqueoRestante;
    }

    protected setTiempoBloqueoRestante(valor: number): void {
        this._tiempoBloqueoRestante = valor;
    }


}