namespace CanvasToy {
    export interface IAsyncResource {
        asyncFinished(): Promise<IAsyncResource>;
    }
}
