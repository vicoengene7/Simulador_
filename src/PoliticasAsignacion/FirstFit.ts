import { BloqueMemoria } from "../Memoria/BloqueMemoria";
import { IPoliticaAsignacion } from "./IPoliticaAsignacion";

// SRP: su única responsabilidad es seleccionar un bloque
// aplicando el criterio First-Fit.

export class FirstFit implements IPoliticaAsignacion {

    private tieneEspacioDisponible(bloque: BloqueMemoria, tamanoRequerido: number): boolean {
    return bloque.libre && bloque.tamano >= tamanoRequerido;
    
    };

    // Verifica si el bloque está libre y cuenta con espacio suficiente
    // para almacenar la memoria requerida.


    buscarBloque(bloques: BloqueMemoria[], tamanoRequerido: number): BloqueMemoria | undefined {

        return bloques.find(bloque => this.tieneEspacioDisponible(bloque, tamanoRequerido)

            // Busca el primer bloque de memoria que tenga espacio disponible.
            // Si no encuentra ninguno, devuelve undefined.
        );
    }
}