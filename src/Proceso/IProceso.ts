export interface IProceso {
    ejecutarUnTick(): void;
    estaTerminado(): boolean;
}
