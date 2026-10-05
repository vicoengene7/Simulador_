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

    private _esDespuesDeTicksCpu: number | null;
    private _esDuracion: number;

    constructor(pid: string, tamanoMemoria: number, tiempoCpuTotal: number ){
        const rechazar = (mensaje: string): never => {
            throw new Error(mensaje);
        };
        
        (!Number.isInteger(tamanoMemoria) || tamanoMemoria <= 0) &&
        rechazar("El tamaño de memoria debe ser un entero positivo");
    
        (!Number.isInteger(tiempoCpuTotal) || tiempoCpuTotal <= 0) &&
        rechazar("El tiempo de CPU debe ser un entero positivo");
       
        this._pid = pid;
        this._tamanoMemoria = tamanoMemoria;
        this._tiempoCpuTotal = tiempoCpuTotal;
        this._tiempoCpuRestante = tiempoCpuTotal;
        this._estado = EstadoProceso.NUEVO;
        this._quantumConsumido = 0;
        this._tiempoBloqueoRestante = 0;
        this._esDespuesDeTicksCpu = null;
        this._esDuracion = 0;
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

    //de estado nuevo pasa a esperando memoria cuando el simulador lo admite y le busca memoria
    esperarMemoria(): void {
        this.setEstado(EstadoProceso.ESPERANDO_MEMORIA);
    }

    // de esperando memoria pasa a listo cuando se le asigna un bloque de memoria
    asignarMemoria(): void {
        this.setEstado(EstadoProceso.LISTO);
    }

    // pasa de listo a ejecutando
    ejecutar(): void {
        this.setEstado(EstadoProceso.EJECUTANDO);
    }

    //de ejecutando pasa a listo si agotó su quantum y 
    //otro proceso espera el cambio de contexto.
    volverAListo(): void {
        this.setEstado(EstadoProceso.LISTO);
        this.setQuantumConsumido(0);
    }

    // de ejecutando pasa a terminado
    terminar(): void {
        this.setEstado(EstadoProceso.TERMINADO);
    }

    reiniciarQuantum(): void {
        this.setQuantumConsumido(0);
    }

    programarES(despuesDeTicksCpu: number, duracion: number): void {
    const valido = Number.isInteger(despuesDeTicksCpu)
        && Number.isInteger(duracion)
        && despuesDeTicksCpu > 0
        && despuesDeTicksCpu < this._tiempoCpuTotal
        && duracion > 0;

    valido? this.guardarES(despuesDeTicksCpu, duracion): this.lanzarErrorES();
    }

    private guardarES(despuesDeTicksCpu: number, duracion: number): void {
    this._esDespuesDeTicksCpu = despuesDeTicksCpu;
    this._esDuracion = duracion;
    }

    private lanzarErrorES(): never {
    throw new Error(
        "La E/S debe ocurrir después de al menos 1 tick de CPU, antes de terminar, y durar al menos 1 tick"
    );
    }

    debeBloquearse(): boolean {
        const cpuConsumida = this._tiempoCpuTotal - this._tiempoCpuRestante;

        return this._esDespuesDeTicksCpu !== null && cpuConsumida === this._esDespuesDeTicksCpu;
    }

    // pasa de ejecutando a bloqueado
    bloquear(): void {
        this.setEstado(EstadoProceso.BLOQUEADO);
        this.setTiempoBloqueoRestante(this._esDuracion);
        this.setQuantumConsumido(0);
        this._esDespuesDeTicksCpu = null;
    }

    // Pasa un tick de espera de E/S.
    avanzarBloqueo(): void {
        this.setTiempoBloqueoRestante(this._tiempoBloqueoRestante - 1);
    }

    // bloqueado a listo porque sus ticks de E/S terminaron
    desbloquear(): void {
        this.setEstado(EstadoProceso.LISTO);
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