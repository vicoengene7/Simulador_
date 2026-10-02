import { BloqueMemoria } from "./BloqueMemoria";
import { IAdministradorMemoria } from "./IAdministradorMemoria";

export class AdministradorMemoria implements IAdministradorMemoria {
    private _tamanoTotal: number;
    private _bloques: BloqueMemoria[];

    constructor(tamanoTotal: number) {
        this._tamanoTotal = this.validarEnteroPositivo(tamanoTotal);

        const bloqueInicial = new BloqueMemoria(0, this._tamanoTotal);

        this._bloques = [];
        this._bloques.push(bloqueInicial);
    }

    // Comprueba que el tamaño ingresado sea un número entero mayor que cero.
    private validarEnteroPositivo(valor: number): number {
        return Number.isInteger(valor) && valor > 0
            ? valor
            : this.lanzarError();
    }

    private lanzarError(): never {
        throw new Error("El tamaño total debe ser un número entero positivo");
    }

    get tamanoTotal(): number {
        return this._tamanoTotal;
    }

    get bloques(): BloqueMemoria[] {
        return [...this._bloques];
    }
}