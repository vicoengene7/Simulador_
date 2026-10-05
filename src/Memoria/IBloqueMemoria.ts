export interface IBloqueMemoria {
    ocupar(pid: string): void;
    liberar(): void;
    describir(): string;
}