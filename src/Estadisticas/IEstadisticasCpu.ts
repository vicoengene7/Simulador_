export interface IEstadisticasCpu {
    avanzarReloj(): void;
    registrarEjecucion(huboEjecucion: boolean): void;
    registrarCambioDeContexto(): void;
    tickActual(): number;
    usoCpu(): number;
    cambiosDeContexto(): number;
}