import { describe, test, expect } from "vitest";
import { Simulador } from "../src/Simulador/Simulador";
import { Proceso } from "../src/Proceso/Proceso";

// Lote de referencia de la consigna: PID, KB, ticks de CPU. First-Fit, quantum 2, memoria 1024 KB.
function simuladorDelLote(): Simulador {
    const simulador = new Simulador(2, 1024);
    simulador.agregarProceso(new Proceso("P1", 200, 4));
    simulador.agregarProceso(new Proceso("P2", 350, 3));
    simulador.agregarProceso(new Proceso("P3", 150, 2));
    simulador.agregarProceso(new Proceso("P4", 400, 3));
    return simulador;
}

// Hace avanzar el simulador la cantidad de ticks que se le pida.
function avanzar(simulador: Simulador, ticks: number): void {
    Array.from({ length: ticks }).forEach(() => simulador.avanzarTick());
}

describe("Simulador", () => {
    // La simulación arranca en el tick 0, con la memoria vacía y la CPU libre.
    test("arranca en el tick 0 con la memoria vacía y la CPU libre", () => {
        const simulador = new Simulador();

        expect(simulador.tickActual()).toBe(0);
        expect(simulador.procesoEnCpu()).toBeUndefined();
        expect(simulador.usoCpu()).toBe(0);
        expect(simulador.metricasMemoria().libreTotal).toBe(1024);
    });

    // Quantum y memoria son configurables (por defecto, los de la consigna: 2 y 1024 KB).
    test("el tamaño de memoria y el quantum son configurables", () => {
        const simulador = new Simulador(3, 2048);

        expect(simulador.metricasMemoria().total).toBe(2048);
    });

    // Un proceso recién registrado está NUEVO: todavía no se pidió memoria.
    test("un proceso registrado queda en estado NUEVO", () => {
        const simulador = new Simulador();

        simulador.agregarProceso(new Proceso("P1", 200, 4));

        expect(simulador.estados()).toEqual(["P1: NUEVO"]);
    });

    // Tick 1: P1, P2 y P3 reciben memoria (700 KB) y P1 toma la CPU. P4 pide 400 KB y solo quedan 324:
    // queda ESPERANDO_MEMORIA.
    test("en el tick 1 P1 usa la CPU y P4 espera memoria", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 1);

        expect(simulador.tickActual()).toBe(1);
        expect(simulador.procesoEnCpu()).toBe("P1");
        expect(simulador.pidsListos()).toEqual(["P2", "P3"]);
        expect(simulador.pidsEsperandoMemoria()).toEqual(["P4"]);
        expect(simulador.metricasMemoria().libreTotal).toBe(324);
        expect(simulador.mapaMemoria()).toEqual([
            "[0-200 KB] P1", "[200-550 KB] P2", "[550-700 KB] P3", "[700-1024 KB] LIBRE"
        ]);
    });

    // Tick 2: P1 agota su quantum (2) con otros esperando -> sale de la CPU, va al final de listos
    // y se cuenta 1 cambio de contexto.
    test("al agotar el quantum P1 vuelve al final de la cola y hay 1 cambio de contexto", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 2);

        expect(simulador.pidsListos()).toEqual(["P2", "P3", "P1"]);
        expect(simulador.cambiosDeContexto()).toBe(1);
    });

    // Tick 3: Round-Robin le da la CPU al siguiente de la cola, P2.
    test("en el tick 3 la CPU pasa a P2", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 3);

        expect(simulador.procesoEnCpu()).toBe("P2");
    });

    // Tick 6: P3 termina y libera 550-700, que está pegado al hueco final (700-1024):
    // la coalescencia los une en un solo hueco de 474 KB, sin fragmentación.
    test("al terminar P3 su bloque se une con el hueco contiguo", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 6);
        const memoria = simulador.metricasMemoria();

        expect(simulador.pidsTerminados()).toEqual(["P3"]);
        expect(memoria.libreTotal).toBe(474);
        expect(memoria.mayorHueco).toBe(474);
        expect(memoria.fragmentacionExterna).toBe(0);
    });

    // Tick 7: con la memoria que liberó P3, P4 por fin entra (400 KB) y pasa de ESPERANDO_MEMORIA a LISTO.
    test("P4 consigue memoria cuando P3 la libera", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 7);

        expect(simulador.pidsEsperandoMemoria()).toEqual([]);
        expect(simulador.estados()).toContain("P4: LISTO");
    });

    // Tick 8: al terminar P1 quedan dos huecos separados por P2 y P4: 200 KB al inicio y 74 KB al final.
    // Libre total 274, mayor hueco 200, entonces (1 - 200/274) x 100 = 27,01 % de fragmentación externa.
    test("fragmentación externa: dos huecos separados producen 27,01 %", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 8);
        const memoria = simulador.metricasMemoria();

        expect(memoria.libreTotal).toBe(274);
        expect(memoria.mayorHueco).toBe(200);
        expect(memoria.fragmentacionExterna).toBeCloseTo(27.01, 2);
    });

    // Fin: los 4 procesos terminaron, la memoria volvió a ser UN solo bloque libre de 1024 KB.
    test("al terminar todos los procesos la memoria vuelve a ser un único bloque libre", () => {
        const simulador = simuladorDelLote();

        avanzar(simulador, 12);

        expect(simulador.pidsTerminados().sort()).toEqual(["P1", "P2", "P3", "P4"]);
        expect(simulador.mapaMemoria()).toEqual(["[0-1024 KB] LIBRE"]);
        expect(simulador.metricasMemoria().ocupada).toBe(0);
    });

    // La simulación es determinista: el mismo lote da exactamente el mismo resultado,
    // porque el avance depende solo de los ticks y no de tiempos reales.
    test("la simulación es determinista", () => {
        const a = simuladorDelLote();
        const b = simuladorDelLote();

        avanzar(a, 12);
        avanzar(b, 12);

        expect(a.estados()).toEqual(b.estados());
        expect(a.cambiosDeContexto()).toBe(b.cambiosDeContexto());
        expect(a.usoCpu()).toBe(b.usoCpu());
    });

    // P1 necesita 3 ticks de CPU y hace una E/S de 2 ticks tras el primero.
    // Tick 1: usa la CPU y pasa a BLOQUEADO (cuenta un cambio de contexto).
    // Ticks 2 y 3: sigue BLOQUEADO y la CPU queda ociosa.
    // Tick 4: vuelve a LISTO y usa la CPU; tick 5: termina. CPU ocupada 3 de 5 ticks = 60 %.
    test("un proceso se bloquea por E/S, espera y vuelve a la cola de listos", () => {
        const simulador = new Simulador(2, 1024);
        const p1 = new Proceso("P1", 100, 3);
        p1.programarES(1, 2);
        simulador.agregarProceso(p1);

        avanzar(simulador, 1);
        expect(simulador.estados()).toEqual(["P1: BLOQUEADO"]);
        expect(simulador.pidsBloqueados()).toEqual(["P1"]);
        expect(simulador.cambiosDeContexto()).toBe(1);

        avanzar(simulador, 2);
        expect(simulador.pidsBloqueados()).toEqual(["P1"]);
        expect(simulador.procesoEnCpu()).toBeUndefined();

        avanzar(simulador, 1);
        expect(simulador.pidsBloqueados()).toEqual([]);
        expect(simulador.procesoEnCpu()).toBe("P1");

        avanzar(simulador, 1);
        expect(simulador.pidsTerminados()).toEqual(["P1"]);
        expect(simulador.usoCpu()).toBe(60);
    });

    // Un proceso bloqueado CONSERVA su memoria: solo se libera cuando termina.
    test("un proceso bloqueado conserva su memoria", () => {
        const simulador = new Simulador(2, 1024);
        const proceso1 = new Proceso("P1", 100, 3);
        proceso1.programarES(1, 2);
        simulador.agregarProceso(proceso1);

        avanzar(simulador, 2);

        expect(simulador.metricasMemoria().ocupada).toBe(100);
    });

    // Sin procesos, la CPU está ociosa todos los ticks: 0 % de uso, aunque el reloj avance.
    test("métricas: sin procesos la CPU no se utiliza", () => {
        const simulador = new Simulador();

        avanzar(simulador, 3);

        expect(simulador.tickActual()).toBe(3);
        expect(simulador.usoCpu()).toBe(0);
    });
    

});
