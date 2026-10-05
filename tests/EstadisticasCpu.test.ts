import { describe, test, expect } from "vitest";
import { EstadisticasCpu } from "../src/Estadisticas/EstadisticasCpu";

describe("EstadisticasCpu", () => {

    // Sin ticks no hay nada que dividir: el uso es 0 %, sin error por división por cero.
    test("en el tick 0 el uso de CPU es 0 %", () => {
        const estadisticas = new EstadisticasCpu();

        expect(estadisticas.tickActual()).toBe(0);
        expect(estadisticas.usoCpu()).toBe(0);
        expect(estadisticas.cambiosDeContexto()).toBe(0);
    });

    // El tiempo es discreto: cada llamada avanza un tick (consigna, punto 11).
    test("avanzarReloj suma 1 al tick actual", () => {
        const estadisticas = new EstadisticasCpu();

        estadisticas.avanzarReloj();
        estadisticas.avanzarReloj();

        expect(estadisticas.tickActual()).toBe(2);
    });

    // Uso de CPU (%) = ticks con CPU ocupada / ticks totales x 100.
    // De 2 ticks, la CPU trabajó en 1 y estuvo ociosa en el otro: 1/2 x 100 = 50 %.
    test("el uso de CPU es la proporción de ticks con CPU ocupada", () => {
        const estadisticas = new EstadisticasCpu();
        estadisticas.avanzarReloj();
        estadisticas.avanzarReloj();

        estadisticas.registrarEjecucion(true);
        estadisticas.registrarEjecucion(false);

        expect(estadisticas.usoCpu()).toBe(50);
    });

    // Cambio de contexto: guardar el estado del proceso que sale y cargar el del que entra.
    // Es un contador que solo sube.
    test("registrarCambioDeContexto acumula los cambios de contexto", () => {
        const estadisticas = new EstadisticasCpu();

        estadisticas.registrarCambioDeContexto();
        estadisticas.registrarCambioDeContexto();

        expect(estadisticas.cambiosDeContexto()).toBe(2);
    });

});
