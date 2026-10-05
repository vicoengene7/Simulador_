import { describe, test, expect } from "vitest";
import { BloqueMemoria } from "../src/Memoria/BloqueMemoria";

describe("BloqueMemoria", () => {

    test("debe iniciar como un bloque libre y sin proceso asignado", () => {
        const bloque = new BloqueMemoria(0, 1000);

        expect(bloque.inicio).toBe(0);
        expect(bloque.tamano).toBe(1000);
        expect(bloque.libre).toBe(true);
        expect(bloque.pid).toBe(null);
    });

    test("debe quedar ocupado al asignarle un proceso", () => {
        const bloque = new BloqueMemoria(0, 1000);

        bloque.ocupar("P1");

        expect(bloque.libre).toBe(false);
        expect(bloque.pid).toBe("P1");
    });



});