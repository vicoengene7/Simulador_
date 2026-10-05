import {describe, test, expect} from "vitest";
import {Proceso} from "../src/Proceso/Proceso";
import { EstadoProceso } from "../src/Proceso/EstadoProceso";

describe("Proceso", () => {

    test("RF02: debe almacenar los datos iniciales del proceso", () => {
        const proceso = new Proceso("P1", 200, 4);

        expect(proceso.pid).toBe("P1");
        expect(proceso.tamanoMemoria).toBe(200);
        expect(proceso.tiempoCpuTotal).toBe(4);
        expect(proceso.tiempoCpuRestante).toBe(4);
        expect(proceso.quantumConsumido).toBe(0);
        expect(proceso.tiempoBloqueoRestante).toBe(0);
    });

    test("RF03: debe iniciar el proceso en estado NUEVO", () => {
        const proceso = new Proceso("P1", 200, 4);

        expect(proceso.estado).toBe(EstadoProceso.NUEVO);
    });

    test("debe actualizar el tiempo de CPU restante y el quantum al ejecutar un tick", () => {
    const proceso = new Proceso("P1", 200, 4);

    proceso.ejecutarUnTick();

    expect(proceso.tiempoCpuRestante).toBe(3);
    expect(proceso.quantumConsumido).toBe(1);

    });

    test("debe indicar que terminó cuando no le queda tiempo de CPU", () => {
    const proceso = new Proceso("P1", 200, 2);

    proceso.ejecutarUnTick();
    proceso.ejecutarUnTick();

    expect(proceso.estaTerminado()).toBe(true);
    });
    
    test("no está terminado si todavía le queda tiempo de CPU", () => {
     const proceso = new Proceso("P1", 200, 2);
     proceso.ejecutarUnTick();
     expect(proceso.estaTerminado()).toBe(false);
    });

    test("recorre los estados NUEVO, ESPERANDO_MEMORIA, LISTO, EJECUTANDO y TERMINADO", () => {
        const proceso = new Proceso("P1", 200, 1);

        proceso.esperarMemoria();
        expect(proceso.estado).toBe(EstadoProceso.ESPERANDO_MEMORIA);

        proceso.asignarMemoria();
        expect(proceso.estado).toBe(EstadoProceso.LISTO);

        proceso.ejecutar();
        expect(proceso.estado).toBe(EstadoProceso.EJECUTANDO);

        proceso.ejecutarUnTick();
        proceso.terminar();
        expect(proceso.estado).toBe(EstadoProceso.TERMINADO);
    });

    test("al volver a listo por quantum agotado reinicia el quantum consumido", () => {
        const proceso = new Proceso("P1", 200, 4);
        proceso.ejecutar();
        proceso.ejecutarUnTick();

        proceso.volverAListo();

        expect(proceso.estado).toBe(EstadoProceso.LISTO);
        expect(proceso.quantumConsumido).toBe(0);
    });

        test("un proceso sin E/S programada nunca debe bloquearse", () => {
        const proceso = new Proceso("P1", 200, 4);

        proceso.ejecutarUnTick();
        proceso.ejecutarUnTick();

        expect(proceso.debeBloquearse()).toBe(false);
    });

    test("se bloquea al consumir la CPU programada y vuelve a LISTO al terminar la E/S", () => {
        const proceso = new Proceso("P1", 200, 4);
        proceso.programarES(2, 3);

        proceso.ejecutarUnTick();
        expect(proceso.debeBloquearse()).toBe(false);

        proceso.ejecutarUnTick();
        expect(proceso.debeBloquearse()).toBe(true);

        proceso.bloquear();
        expect(proceso.estado).toBe(EstadoProceso.BLOQUEADO);
        expect(proceso.tiempoBloqueoRestante).toBe(3);
        expect(proceso.quantumConsumido).toBe(0);

        proceso.avanzarBloqueo();
        proceso.avanzarBloqueo();
        proceso.avanzarBloqueo();
        expect(proceso.tiempoBloqueoRestante).toBe(0);

        proceso.desbloquear();
        expect(proceso.estado).toBe(EstadoProceso.LISTO);
    });

    test("la E/S se consume una sola vez", () => {
        const proceso = new Proceso("P1", 200, 4);
        proceso.programarES(1, 2);
        proceso.ejecutarUnTick();
        proceso.bloquear();

        expect(proceso.debeBloquearse()).toBe(false);
    });

    

});
