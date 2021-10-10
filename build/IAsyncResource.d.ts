export interface IAsyncResource {
    asyncFinished: () => Promise<IAsyncResource>;
    setAsyncFinished(promise: Promise<IAsyncResource>): void;
}
