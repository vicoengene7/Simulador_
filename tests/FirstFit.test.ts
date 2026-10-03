import { describe, test, expect } from "vitest";
import { FirstFit } from "../src/PoliticasAsignacion/FirstFit";
import { BloqueMemoria } from "../src/Memoria/BloqueMemoria";

describe("FirstFit", () => {

    test("debe seleccionar el primer bloque libre con espacio suficiente", () => {

        const bloque1 = new BloqueMemoria(0, 100);
        bloque1.ocupar("P1");

        const bloque2 = new BloqueMemoria(100, 200);

        const bloque3 = new BloqueMemoria(300, 500);
        bloque3.ocupar("P3");

        const politica = new FirstFit();

        const bloqueEncontrado = politica.buscarBloque([bloque1, bloque2, bloque3],150);

        expect(bloqueEncontrado).toBe(bloque2);
    });

});