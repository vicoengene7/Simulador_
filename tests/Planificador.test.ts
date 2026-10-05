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


});


