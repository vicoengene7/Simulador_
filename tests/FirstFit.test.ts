import { describe, test, expect } from "vitest";
import { FirstFit } from "../src/PoliticasAsignacion/FirstFit";
import { BloqueMemoria } from "../src/Memoria/BloqueMemoria";

// Tres huecos libres de 300, 150 y 500 KB (en ese orden de dirección). Se piden 100 KB:
// los tres algoritmos entran en cualquiera, pero cada uno elige uno distinto.
function tresHuecos(): BloqueMemoria[] {
    return [
        new BloqueMemoria(0, 300),
        new BloqueMemoria(300, 150),
        new BloqueMemoria(450, 500)
    ];
}


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

    // First-Fit se queda con el primero que sirve, aunque haya uno que ajuste mejor más adelante.
    test("elige el primero que alcanza, aunque no sea el que mejor ajusta", () => {
        const huecos = tresHuecos();

        expect(new FirstFit().buscarBloque(huecos, 100)).toBe(huecos[0]);
    });

     // Un bloque grande pero OCUPADO no cuenta como hueco.
    test("ignora los bloques ocupados aunque sean grandes", () => {
        const ocupado = new BloqueMemoria(0, 1000);
        ocupado.ocupar("P1");

        expect(new FirstFit().buscarBloque([ocupado], 10)).toBeUndefined();
    });

    // Si ningún libre alcanza, devuelve undefined (el proceso queda esperando memoria).
    test("devuelve undefined si ningún bloque libre alcanza", () => {
        expect(new FirstFit().buscarBloque(tresHuecos(), 600)).toBeUndefined();
    });


});