import { IEstadisticasCpu } from "./IEstadisticasCpu";

// Lleva el reloj de la simulación (en ticks), los ticks con CPU ocupada y los cambios de contexto.
// SRP: solo cuenta. No decide qué proceso ejecuta.

export class EstadisticasCpu implements IEstadisticasCpu {
    private _reloj: number = 0;
    private _ticksOcupada: number = 0;
    private _cambiosDeContexto: number = 0;

    // El tiempo es discreto: cada llamada es un tick.
    avanzarReloj(): void {
        this._reloj++;
    }

    // Si hubo ejecución suma 1; si no hubo ejecución suma 0.
    registrarEjecucion(huboEjecucion: boolean): void {
        this._ticksOcupada += huboEjecucion ? 1 : 0;
    }

    // Se cuenta cuando un proceso deja la CPU por quantum o por E/S.
    registrarCambioDeContexto(): void {
        this._cambiosDeContexto++;
    }

    tickActual(): number {
        return this._reloj;
    }

    // Utilización de CPU (%) = ticks con CPU ocupada / ticks totales x 100.
    // En el tick 0 devuelve 0 para evitar la división por cero.
    usoCpu(): number {
        return this._reloj === 0 ? 0 : (this._ticksOcupada / this._reloj) * 100;
    }

    cambiosDeContexto(): number {
        return this._cambiosDeContexto;
    }
}