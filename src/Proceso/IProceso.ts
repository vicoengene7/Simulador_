export interface IProceso {
    ejecutarUnTick(): void;
    estaTerminado(): boolean;
    esperarMemoria(): void;
    asignarMemoria(): void;
    ejecutar(): void;
    volverAListo(): void;
    programarES(despuesDeTicksCpu: number, duracion: number): void;
    debeBloquearse(): boolean;
    bloquear(): void;
    avanzarBloqueo(): void;
    desbloquear(): void;
    terminar(): void;
    reiniciarQuantum(): void;
}
