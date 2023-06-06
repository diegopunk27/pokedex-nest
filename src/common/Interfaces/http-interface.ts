export interface HttpInterface{
    get<T>( url:string ) : Promise<T>;
}