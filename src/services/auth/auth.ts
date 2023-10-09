import { Account } from "types/auth";
import { api } from "./baseQuery";


export const authAPI = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<Account.DTO, Account.Credentials>({
            query: (credentials) => ({
                url: '/account/customer/login/',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const { useLoginMutation } = authAPI