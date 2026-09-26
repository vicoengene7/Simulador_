import {describe, test, expect} from "vitest";
import {Proceso} from "../src//Proceso";

describe("Proceso", ()=> {
    test ("Creacion de un proceso P1", ()=>{
    const proceso1= new Proceso("P1", 200, 4);

    expect(proceso1.pid).toBe("P1");
    expect(proceso1.tamanoMemoria).toBe(200);
    expect(proceso1.tiempoCpuTotal).toBe(4);
    
    });

    test ("P1 creado con propiedades iniciales", ()=>{
    const proceso= new Proceso("P1", 200, 4);

    expect(proceso.estado).toBe("Nuevo");
    expect(proceso.tiempoBloqueRestante).toBe(0);
    expect(proceso.quantumConsumido).toBe(0);

    });

});