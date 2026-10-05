import { AdministradorMemoria } from "../Memoria/AdministradorMemoria";
import { IAdministradorMemoria } from "../Memoria/IAdministradorMemoria";
import { Planificador } from "../Planificación/Planificador";
import { IPlanificador } from "../Planificación/IPlanificador";
import { IResultadoTick } from "../Planificación/IResultadoTick";
import { IPoliticaAsignacion } from "../PoliticasAsignacion/IPoliticaAsignacion";
import { FirstFit } from "../PoliticasAsignacion/FirstFit";
import { Proceso } from "../Proceso/Proceso";
import { EstadisticasCpu } from "../Estadisticas/EstadisticasCpu";
import { IEstadisticasCpu } from "../Estadisticas/IEstadisticasCpu";
import { ISimulador } from "./ISimulador";

// Simulación DISCRETA: avanza por ticks y en cada uno repite los mismos pasos, en el mismo orden:
//   A) admisión: nuevos -> esperando memoria, y se reintenta asignar memoria
//   B) E/S: los procesos bloqueados avanzan su espera (y los que terminaron vuelven a listos)
//   C) CPU: el planificador Round-Robin ejecuta un tick
//   D) reacción: terminado -> libera memoria; rotado o bloqueado -> cambio de contexto.
//
// Composición: el simulador TIENE una memoria, un planificador y unas estadísticas, y las coordina.
// SRP: solo orquesta; cada colaboradora hace lo suyo.

export class Simulador implements ISimulador {

    private readonly _memoria: IAdministradorMemoria;
    private readonly _planificador: IPlanificador;
    private readonly _estadisticas: IEstadisticasCpu = new EstadisticasCpu();

    private _todos: Proceso[] = [];
    private _nuevos: Proceso[] = [];
    private _esperandoMemoria: Proceso[] = [];
    private _bloqueados: Proceso[] = [];
    private _terminados: Proceso[] = [];

    // RF01: quantum, memoria total y política de asignación se eligen al crear el simulador.
    // Valores por defecto de la consigna: quantum 2, 1024 KB, First-Fit.
    constructor(quantum: number = 2, memoriaTotal: number = 1024,politica: IPoliticaAsignacion = new FirstFit()
    ) {
        this._planificador = new Planificador(quantum);
        this._memoria = new AdministradorMemoria(memoriaTotal, politica);
    }

    // Rechaza PID repetidos y procesos que piden más memoria que toda la RAM.
    agregarProceso(proceso: Proceso): void {
        const pidRepetido = this._todos.some(p => p.pid === proceso.pid);

        pidRepetido ? this.lanzarErrorPidRepetido(proceso.pid) : this.validarMemoriaProceso(proceso);
    }

    private validarMemoriaProceso(proceso: Proceso): void {
        const superaMemoria = proceso.tamanoMemoria > this._memoria.metricas().total;

        superaMemoria ? this.lanzarErrorMemoriaProceso(proceso) : this.registrarProceso(proceso);
    }

    private registrarProceso(proceso: Proceso): void {
        this._todos.push(proceso);
        this._nuevos.push(proceso);
    }

    private lanzarErrorPidRepetido(pid: string): never {
        throw new Error(`Ya existe un proceso con PID ${pid}`);
    }

    private lanzarErrorMemoriaProceso(proceso: Proceso): never {
        throw new Error(
            `El proceso ${proceso.pid} pide ${proceso.tamanoMemoria} KB, más que la memoria total`
        );
    }

    avanzarTick(): void {
        this._estadisticas.avanzarReloj();

        this.admitirNuevos();
        this.reintentarMemoria();
        this.avanzarBloqueados();
        this.reaccionar(this._planificador.ejecutarTick());
    }

    // NUEVO -> ESPERANDO_MEMORIA.
    private admitirNuevos(): void {
        this._nuevos.forEach(p => {
            p.esperarMemoria();
            this._esperandoMemoria.push(p);
        });

        this._nuevos = [];
    }

    private reintentarMemoria(): void {
        const siguenEsperando: Proceso[] = [];

        for (const proceso of this._esperandoMemoria) {
            const memoriaAsignada = this._memoria.asignar(proceso.pid, proceso.tamanoMemoria);

            memoriaAsignada ? this.enviarAListos(proceso) : siguenEsperando.push(proceso);
        }

        this._esperandoMemoria = siguenEsperando;
    }

    private enviarAListos(proceso: Proceso): void {
        proceso.asignarMemoria();
        this._planificador.agregarListo(proceso);
    }

    private avanzarBloqueados(): void {
        const cumplieron = this._bloqueados.filter(
            p => p.tiempoBloqueoRestante === 0
        );

        this._bloqueados = this._bloqueados.filter(
            p => p.tiempoBloqueoRestante > 0
        );

        this._bloqueados.forEach(
            p => p.avanzarBloqueo()
        );

        cumplieron.forEach(p => {
            p.desbloquear();
            this._planificador.agregarListo(p);
        });
    }

    private reaccionar(resultado: IResultadoTick): void {
        this._estadisticas.registrarEjecucion(resultado.ocupado);

        resultado.terminado === undefined ? undefined : this.registrarTerminado(resultado.terminado);

        resultado.rotado === undefined ? undefined : this._estadisticas.registrarCambioDeContexto();

        resultado.bloqueado === undefined ? undefined : this.registrarBloqueado(resultado.bloqueado);
    }

    private registrarTerminado(proceso: Proceso): void {
        this._memoria.liberar(proceso.pid);
        this._terminados.push(proceso);
    }

    private registrarBloqueado(proceso: Proceso): void {
        this._bloqueados.push(proceso);
        this._estadisticas.registrarCambioDeContexto();
    }

    tickActual(): number {
        return this._estadisticas.tickActual();
    }

    usoCpu(): number {
        return this._estadisticas.usoCpu();
    }

    cambiosDeContexto(): number {
        return this._estadisticas.cambiosDeContexto();
    }

    procesoEnCpu(): string | undefined {
        return this._planificador.procesoEnCpu();
    }

    metricasMemoria(): IMetricas {
        return this._memoria.metricas();
    }

    mapaMemoria(): string[] {
        return this._memoria.mapa();
    }

    // Estado de cada proceso en el orden de registro.
    // Ejemplo: "P1: EJECUTANDO".
    estados(): string[] {
        return this._todos.map(
            p => `${p.pid}: ${p.estado}`
        );
    }

    pidsListos(): string[] {
        return this._planificador.pidsListos();
    }

    pidsEsperandoMemoria(): string[] {
        return this._esperandoMemoria.map(
            p => p.pid
        );
    }

    pidsBloqueados(): string[] {
        return this._bloqueados.map(
            p => p.pid
        );
    }

    pidsTerminados(): string[] {
        return this._terminados.map(
            p => p.pid
        );
    }
}