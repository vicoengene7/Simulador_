import { describe, test, expect } from "vitest";
import { AdministradorMemoria } from "../src/Memoria/AdministradorMemoria";

describe("AdministradorMemoria", () => {

    test("RF01: debe iniciar con un único bloque libre que ocupe toda la memoria", () => {
        const memoria = new AdministradorMemoria(1024);

        expect(memoria.memoriaTotal).toBe(1024);
        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].inicio).toBe(0);
        expect(memoria.bloques[0].tamano).toBe(1024);
        expect(memoria.bloques[0].libre).toBe(true);
        expect(memoria.bloques[0].pid).toBe(null);
    });


});