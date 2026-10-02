export enum EstadoProceso{
    NUEVO = "NUEVO",
    ESPERANDO_MEMORIA = "ESPERANDO_MEMORIA",
    LISTO = "LISTO",
    EJECUTANDO = "EJECUTANDO",
    BLOQUEADO = "BLOQUEADO",
    TERMINADO = "TERMINADO"
}
//enum sirve para definir un conjunto de valores limmitados
//en este caso, los estados posibles de un proceso en un SO.
//Cada etapa representa el estado del proceso desde su creación hasta su finalización.
