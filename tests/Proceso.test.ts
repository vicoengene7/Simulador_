import {describe, test, expect} from "vitest";
import {Proceso} from "../src/Proceso/Proceso";
import { EstadoProceso } from "../src/Proceso/EstadoProceso";

describe("Proceso", () => {

    test("RF02 - debe almacenar los datos iniciales del proceso", () => {
        const proceso = new Proceso("P1", 200, 4);

        expect(proceso.pid).toBe("P1");
        expect(proceso.tamanoMemoria).toBe(200);
        expect(proceso.tiempoCpuTotal).toBe(4);
        expect(proceso.tiempoCpuRestante).toBe(4);
        expect(proceso.quantumConsumido).toBe(0);
        expect(proceso.tiempoBloqueRestante).toBe(0);
    });

    test("RF03 - debe iniciar el proceso en estado NUEVO", () => {
        const proceso = new Proceso("P1", 200, 4);

        expect(proceso.estado).toBe(EstadoProceso.NUEVO);
    });

});