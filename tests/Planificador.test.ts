import { describe, test, expect } from "vitest";
import { Planificador } from "../src/Planificación/Planificador";
import { Proceso } from "../src/Proceso/Proceso";
import { EstadoProceso } from "../src/Proceso/EstadoProceso";

describe("Planificador Round-Robin", () => {

    test("el quantum es configurable", () => {
        expect(new Planificador(2).quantum).toBe(2);
        expect(new Planificador(5).quantum).toBe(5);
    });

    test("rechaza un quantum igual a cero", () => {
        expect(() => new Planificador(0)).toThrow(
            "El quantum debe ser un entero positivo"
        );
    });
    
    test("rechaza un quantum que no sea entero", () => {
        expect(() => new Planificador(1.5)).toThrow(
            "El quantum debe ser un entero positivo"
        );
    });

    test("con la cola de listos vacía la CPU queda libre", () => {
        const planificador = new Planificador(2);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(false);
        expect(planificador.procesoEnCpu()).toBeUndefined();
        expect(planificador.pidsListos()).toEqual([]);
    });
    
    test("despacha el primer proceso de la cola de listos", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 4);
        const proceso2 = new Proceso("P2", 100, 4);

        planificador.agregarListo(proceso1);
        planificador.agregarListo(proceso2);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);

        expect(planificador.procesoEnCpu()).toBe("P1");

        expect(proceso1.estado).toBe(EstadoProceso.EJECUTANDO);

        expect(planificador.pidsListos()).toEqual(["P2"]);
    });

    test("el proceso continúa en CPU si no termina, no se bloquea y no agota el quantum", () => {
        const planificador = new Planificador(3);

        const proceso1 = new Proceso("P1", 100, 5);

        planificador.agregarListo(proceso1);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);
        expect(resultado.terminado).toBeUndefined();
        expect(resultado.bloqueado).toBeUndefined();
        expect(resultado.rotado).toBeUndefined();

        expect(planificador.procesoEnCpu()).toBe("P1");

        expect(proceso1.tiempoCpuRestante).toBe(4);
        expect(proceso1.quantumConsumido).toBe(1);
    });

    test("al agotar el quantum con otro proceso esperando vuelve al final de la cola", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 4);
        const proceso2 = new Proceso("P2", 100, 4);

        planificador.agregarListo(proceso1);
        planificador.agregarListo(proceso2);

        const tick1 = planificador.ejecutarTick();
        const tick2 = planificador.ejecutarTick();

        expect(tick1.ocupado).toBe(true);
        expect(tick1.rotado).toBeUndefined();

        expect(tick2.ocupado).toBe(true);
        expect(tick2.rotado).toBe(proceso1);

        expect(proceso1.estado).toBe(EstadoProceso.LISTO);
        expect(proceso1.quantumConsumido).toBe(0);

        expect(planificador.pidsListos()).toEqual(["P2","P1"]);

        expect(planificador.procesoEnCpu()).toBeUndefined();
    });

    test("después de una rotación se despacha el siguiente proceso", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 4);
        const proceso2 = new Proceso("P2", 100, 4);

        planificador.agregarListo(proceso1);
        planificador.agregarListo(proceso2);

        planificador.ejecutarTick();
        planificador.ejecutarTick();

        planificador.ejecutarTick();

        expect(planificador.procesoEnCpu()).toBe("P2");
        expect(proceso2.estado).toBe(EstadoProceso.EJECUTANDO);

        expect(planificador.pidsListos()).toEqual(["P1"]);
    });

    test("renueva el quantum si no hay otro proceso esperando", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 4);

        planificador.agregarListo(proceso1);

        planificador.ejecutarTick();
        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);
        expect(resultado.rotado).toBeUndefined();

        expect(planificador.procesoEnCpu()).toBe("P1");

        expect(proceso1.estado).toBe(EstadoProceso.EJECUTANDO);
        expect(proceso1.quantumConsumido).toBe(0);
    });

    test("al consumir el último tick el proceso termina y libera la CPU", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 1);

        planificador.agregarListo(proceso1);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);
        expect(resultado.terminado).toBe(proceso1);

        expect(proceso1.estado).toBe(EstadoProceso.TERMINADO);

        expect(planificador.procesoEnCpu()).toBeUndefined();
    });

    test("bloquea un proceso cuando alcanza su E/S programada", () => {
        const planificador = new Planificador(5);

        const proceso1 = new Proceso("P1", 100, 3);

        proceso1.programarES(1, 2);

        planificador.agregarListo(proceso1);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);
        expect(resultado.bloqueado).toBe(proceso1);

        expect(proceso1.estado).toBe(EstadoProceso.BLOQUEADO);

        expect(planificador.procesoEnCpu()).toBeUndefined();
    });

    test("rechaza un quantum negativo", () => {
        expect(() => new Planificador(-1)).toThrow(
            "El quantum debe ser un entero positivo"
        );
    });

    test("rechaza un quantum que no sea entero", () => {
        expect(() => new Planificador(1.5)).toThrow(
            "El quantum debe ser un entero positivo"
        );
    });

    test("con la cola de listos vacía la CPU queda libre", () => {
        const planificador = new Planificador(2);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(false);
        expect(planificador.procesoEnCpu()).toBeUndefined();
        expect(planificador.pidsListos()).toEqual([]);
    });

     test("despacha el primer proceso de la cola de listos", () => {
        const planificador = new Planificador(2);

        const proceso1 = new Proceso("P1", 100, 4);
        const proceso2 = new Proceso("P2", 100, 4);

        planificador.agregarListo(proceso1);
        planificador.agregarListo(proceso2);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);

        expect(planificador.procesoEnCpu()).toBe("P1");

        expect(proceso1.estado).toBe(EstadoProceso.EJECUTANDO);

        expect(planificador.pidsListos()).toEqual(["P2"]);
    });

    test("el proceso continúa en CPU si no termina, no se bloquea y no agota el quantum", () => {
        const planificador = new Planificador(3);

        const proceso1 = new Proceso("P1", 100, 5);

        planificador.agregarListo(proceso1);

        const resultado = planificador.ejecutarTick();

        expect(resultado.ocupado).toBe(true);
        expect(resultado.terminado).toBeUndefined();
        expect(resultado.bloqueado).toBeUndefined();
        expect(resultado.rotado).toBeUndefined();

        expect(planificador.procesoEnCpu()).toBe("P1");

        expect(proceso1.tiempoCpuRestante).toBe(4);
        expect(proceso1.quantumConsumido).toBe(1);
    });

});


