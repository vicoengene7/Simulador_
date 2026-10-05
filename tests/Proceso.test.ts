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



});
