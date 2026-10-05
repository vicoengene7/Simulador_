import {BloqueMemoria} from "./BloqueMemoria";
import {IAdministradorMemoria} from "./IAdministradorMemoria";
import { IPoliticaAsignacion } from "../PoliticasAsignacion/IPoliticaAsignacion";
import { FirstFit } from "../PoliticasAsignacion/FirstFit";
import { Proceso } from "../Proceso/Proceso";
import {IMetricas} from "./IMetricas";
import { IBloqueMemoria } from "./IBloqueMemoria";

export class AdministradorMemoria implements IAdministradorMemoria {

    private _memoriaTotal: number;
    private _bloques: BloqueMemoria[];
    private _politicaAsignacion: IPoliticaAsignacion;

    constructor(memoriaTotal: number) {
        this._memoriaTotal = memoriaTotal;
        const bloqueInicial = new BloqueMemoria(0, this._memoriaTotal);

        this._bloques = [];
        this._bloques.push(bloqueInicial);
        this._politicaAsignacion = new FirstFit();
    }
    obtenerBloques(): readonly IBloqueMemoria[] {
        throw new Error("Method not implemented.");
    }

    get memoriaTotal(): number {
        return this._memoriaTotal;
    }

    get bloques(): BloqueMemoria[] {
        return [...this._bloques];
    }

    asignar(pid: string, tamano: number): boolean {
    const tamanoValido = Number.isInteger(tamano) && tamano > 0;

    return tamanoValido ? this.intentarAsignar(pid, tamano) : this.lanzarErrorTamano();
}

private intentarAsignar(pid: string, tamano: number): boolean {
    const bloque = this._politicaAsignacion.buscarBloque(this._bloques, tamano);

    return bloque === undefined ? false : this.asignarBloque(bloque, tamano, pid);
}

private asignarBloque(bloque: BloqueMemoria, tamano: number, pid: string): boolean {
    this.dividirYOcupar(bloque, tamano, pid);
    return true;
}

private lanzarErrorTamano(): never {
    throw new Error("El tamaño pedido debe ser un entero positivo");
}


// Si el bloque es más grande que lo pedido, se parte en dos.
// Si tiene el tamaño justo, solamente se ocupa.
private dividirYOcupar(bloque: BloqueMemoria, tamano: number,pid: string): void {
    const resto = bloque.tamano - tamano;

    resto === 0 ? bloque.ocupar(pid) : this.dividirBloque(bloque, tamano, pid, resto);
}

private dividirBloque(bloque: BloqueMemoria, tamano: number, pid: string, resto: number): void {
    const ocupado = new BloqueMemoria(bloque.inicio, tamano);
    ocupado.ocupar(pid);

    const libre = new BloqueMemoria(bloque.inicio + tamano, resto);

    const posicion = this._bloques.indexOf(bloque);

    this._bloques.splice(posicion,1,ocupado,libre);
}


liberar(pid: string): void {
    const bloque = this._bloques.find(bloque => bloque.pid === pid);

    bloque === undefined ? this.lanzarErrorLiberacion(pid) : this.liberarBloque(bloque);
}

private liberarBloque(bloque: BloqueMemoria): void {
    bloque.liberar();
    this.coalescer();
}

private lanzarErrorLiberacion(pid: string): never {
    throw new Error(`No hay memoria asignada al proceso ${pid}`);
}


// Coalescencia: une bloques libres consecutivos.
private coalescer(): void {
    const resultado: BloqueMemoria[] = [];

    for (const bloque of this._bloques) {
        this.agregarOUnirBloque(resultado, bloque);
    }

    this._bloques = resultado;
}

private agregarOUnirBloque(resultado: BloqueMemoria[], bloque: BloqueMemoria): void {
    const ultimo = resultado[resultado.length - 1];

    const sePuedenUnir = ultimo !== undefined && ultimo.libre && bloque.libre;

    sePuedenUnir ? this.unirBloques(resultado, ultimo, bloque) : resultado.push(bloque);
}

    private unirBloques(resultado: BloqueMemoria[], ultimo: BloqueMemoria, bloque: BloqueMemoria): void {
    resultado[resultado.length - 1] = new BloqueMemoria(
        ultimo.inicio,
        ultimo.tamano + bloque.tamano
    );
}

    obtenerMemoriaTotal(): number {
        return this._memoriaTotal;
    }

    metricas(): IMetricas {
        const libres = this._bloques.filter(b => b.libre).map(b => b.tamano);
        const libreTotal = libres.reduce((suma, tamano) => suma + tamano, 0);
        const mayorHueco = Math.max(0, ...libres);
        const ocupada = this._memoriaTotal - libreTotal;

        return {
            total: this._memoriaTotal,
            ocupada,
            libreTotal,
            mayorHueco,
            porcentajeOcupacion: (ocupada / this._memoriaTotal) * 100,
            fragmentacionExterna: libreTotal === 0 ? 0 : (1 - mayorHueco / libreTotal) * 100
        };
    }


    mapa(): string[] {
        return this._bloques.map(b => b.describir());
    }

}