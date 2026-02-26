"use client"

import { retrieveCustomer } from "@/lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import React, { createContext, useContext, useEffect, useState } from "react"

interface AccountContext {
    customer: HttpTypes.StoreCustomer | null
    refetchCustomer: () => void
    isLoading: boolean
}

const AccountContext = createContext<AccountContext | null>(null)

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCustomer = async () => {
        setIsLoading(true)
        try {
            const customerData = await retrieveCustomer()
            setCustomer(customerData)
        } catch (e) {
            setCustomer(null)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCustomer()
    }, [])

    return (
        <AccountContext.Provider
            value={{
                customer,
                refetchCustomer: fetchCustomer,
                isLoading,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => {
    const context = useContext(AccountContext)
    if (context === null) {
        throw new Error("useAccount must be used within an AccountProvider")
    }
    return context
}
