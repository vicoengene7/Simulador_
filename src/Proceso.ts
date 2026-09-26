export class Proceso{
    private _pid: string;
    private _tamanoMemoria: number;
    private _tiempoCpuTotal: number;
    private _tiempoCpuRestante: number;
    private _estado: string;
    private _quantumConsumido: number;
    private _tiempoBloqueRestante:number;

    constructor(pid: string, tamanoMemoria: number, tiempoCpuTotal: number ){
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = "Nuevo";
        this._quantumConsumido = 0;
        this._tiempoBloqueRestante =0;

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

    get estado(): string{
        return this._estado;
    }
    
    get quantumConsumido(): number{
        return this._quantumConsumido
    }

    get tiempoBloqueRestante(): number{
        return this._tiempoBloqueRestante;
    }


}