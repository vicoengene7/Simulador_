import { describe, test, expect } from "vitest";
import { AdministradorMemoria } from "../src/Memoria/AdministradorMemoria";
import { FirstFit } from "../src/PoliticasAsignacion/FirstFit";


// Arma una memoria de 1000 KB con P1 (0-200), P2 (200-500) y P3 (500-600) y libre 600-1000.
function memoriaConTresProcesos(): AdministradorMemoria {
    const memoria = new AdministradorMemoria(1000);
    memoria.asignar("P1", 200);
    memoria.asignar("P2", 300);
    memoria.asignar("P3", 100);
    return memoria;
}

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
    
    test("el tamaño de la memoria es configurable", () => {
        expect(new AdministradorMemoria(2048).memoriaTotal).toBe(2048);
    });

    test("al asignar parte el bloque en uno ocupado y un hueco con el resto", () => {
        const memoria = new AdministradorMemoria(1024);

        const asignado = memoria.asignar("P1", 200);

        expect(asignado).toBe(true);
        expect(memoria.bloques.length).toBe(2);
        expect(memoria.bloques[0].inicio).toBe(0);
        expect(memoria.bloques[0].tamano).toBe(200);
        expect(memoria.bloques[0].pid).toBe("P1");
        expect(memoria.bloques[1].inicio).toBe(200);
        expect(memoria.bloques[1].tamano).toBe(824);
        expect(memoria.bloques[1].libre).toBe(true);
    });

    test("si el pedido es justo, ocupa el bloque entero sin dejar resto", () => {
        const memoria = new AdministradorMemoria(100);

        memoria.asignar("P1", 100);

        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].libre).toBe(false);
        expect(memoria.bloques[0].pid).toBe("P1");
    });

    test("devuelve false y no cambia nada si no hay un hueco suficiente", () => {
        const memoria = new AdministradorMemoria(100);

        const asignado = memoria.asignar("P1", 150);

        expect(asignado).toBe(false);
        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].libre).toBe(true);
    });

    test("al asignar parte el bloque en uno ocupado y un hueco con el resto", () => {
        const memoria = new AdministradorMemoria(1024);

        const asignado = memoria.asignar("P1", 200);

        expect(asignado).toBe(true);
        expect(memoria.bloques.length).toBe(2);
        expect(memoria.bloques[0].inicio).toBe(0);
        expect(memoria.bloques[0].tamano).toBe(200);
        expect(memoria.bloques[0].pid).toBe("P1");
        expect(memoria.bloques[1].inicio).toBe(200);
        expect(memoria.bloques[1].tamano).toBe(824);
        expect(memoria.bloques[1].libre).toBe(true);
    });

     test("si el pedido es justo, ocupa el bloque entero sin dejar resto", () => {
         const memoria = new AdministradorMemoria(100);

        memoria.asignar("P1", 100);

        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].libre).toBe(false);
        expect(memoria.bloques[0].pid).toBe("P1");
    });

    test("devuelve false y no cambia nada si no hay un hueco suficiente", () => {
        const memoria = new AdministradorMemoria(100);

        const asignado = memoria.asignar("P1", 150);

        expect(asignado).toBe(false);
        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].libre).toBe(true);
    });

    test("liberar deja libre el bloque del proceso", () => {
        const memoria = new AdministradorMemoria(1024);
        memoria.asignar("P1", 200);

        memoria.liberar("P1");

        expect(memoria.bloques.every(b => b.libre)).toBe(true);
    });

    test("coalescencia con el hueco siguiente", () => {
        const memoria = memoriaConTresProcesos();

        memoria.liberar("P3");

        expect(memoria.bloques.length).toBe(3);
        expect(memoria.bloques[2].inicio).toBe(500);
        expect(memoria.bloques[2].tamano).toBe(500);
        expect(memoria.bloques[2].libre).toBe(true);
    });

    test("coalescencia con el hueco anterior", () => {
        const memoria = memoriaConTresProcesos();

        memoria.liberar("P1");
        memoria.liberar("P2");

        expect(memoria.bloques.length).toBe(3);
        expect(memoria.bloques[0].inicio).toBe(0);
        expect(memoria.bloques[0].tamano).toBe(500);
        expect(memoria.bloques[0].libre).toBe(true);
    });

    test("coalescencia con los dos vecinos deja un único bloque", () => {
        const memoria = memoriaConTresProcesos();

        memoria.liberar("P1");
        memoria.liberar("P3");
        memoria.liberar("P2");

        expect(memoria.bloques.length).toBe(1);
        expect(memoria.bloques[0].tamano).toBe(1000);
        expect(memoria.bloques[0].libre).toBe(true);
    });  

   test("métricas: con la memoria vacía todo está libre y sin fragmentación", () => {
        const metricas = new AdministradorMemoria(1024).metricas();

        expect(metricas.total).toBe(1024);
        expect(metricas.ocupada).toBe(0);
        expect(metricas.libreTotal).toBe(1024);
        expect(metricas.mayorHueco).toBe(1024);
        expect(metricas.porcentajeOcupacion).toBe(0);
        expect(metricas.fragmentacionExterna).toBe(0);
    });
    
    test("métricas: calcula la fragmentación externa con la fórmula de la consigna", () => {
        const memoria = memoriaConTresProcesos();

        memoria.liberar("P1");
        const metricas = memoria.metricas();

        expect(metricas.libreTotal).toBe(600);
        expect(metricas.mayorHueco).toBe(400);
        expect(metricas.ocupada).toBe(400);
        expect(metricas.porcentajeOcupacion).toBe(40);
        expect(metricas.fragmentacionExterna).toBeCloseTo(33.33, 2);
    });

    test("métricas: con la memoria llena la fragmentación es 0 y la ocupación 100 %", () => {
        const memoria = new AdministradorMemoria(100);
        memoria.asignar("P1", 100);

        const metricas = memoria.metricas();

        expect(metricas.libreTotal).toBe(0);
        expect(metricas.mayorHueco).toBe(0);
        expect(metricas.porcentajeOcupacion).toBe(100);
        expect(metricas.fragmentacionExterna).toBe(0);
    });

    test("mapa: describe cada bloque en orden", () => {
        const memoria = new AdministradorMemoria(1024);
        memoria.asignar("P1", 200);

        expect(memoria.mapa()).toEqual(["[0-200 KB] P1", "[200-1024 KB] LIBRE"]);
    });
});