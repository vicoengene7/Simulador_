import {BloqueMemoria} from "./BloqueMemoria";
import {IAdministradorMemoria} from "./IAdministradorMemoria";
import { IPoliticaAsignacion } from "../PoliticasAsignacion/IPoliticaAsignacion";
import { FirstFit } from "../PoliticasAsignacion/FirstFit";
import { Proceso } from "../Proceso/Proceso";

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

    get memoriaTotal(): number {
        return this._memoriaTotal;
    }

    get bloques(): BloqueMemoria[] {
        return [...this._bloques];
    }

        
}