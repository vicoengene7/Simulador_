import {BloqueMemoria} from "./BloqueMemoria";
import {IAdministradorMemoria} from "./IAdministradorMemoria";

export class AdministradorMemoria implements IAdministradorMemoria {

    private _memoriaTotal: number;
    private _bloques: BloqueMemoria[];

    constructor(memoriaTotal: number) {
        this._memoriaTotal = memoriaTotal;
        const bloqueInicial = new BloqueMemoria(0, this._memoriaTotal);

        this._bloques = [];
        this._bloques.push(bloqueInicial);
    }

    get memoriaTotal(): number {
        return this._memoriaTotal;
    }

    get bloques(): BloqueMemoria[] {
        return [...this._bloques];
    }
        
}