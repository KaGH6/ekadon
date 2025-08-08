// /types/axios-augment.d.ts
import "axios";
declare module "axios" {
    export interface InternalAxiosRequestConfig<D = any> {
        _retry?: boolean;
    }
}
