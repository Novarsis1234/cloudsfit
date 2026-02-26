import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"

import Radio from "@/modules/common/components/radio"
import compareAddresses from "@/lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <Listbox.Button
          className="relative w-full flex justify-between items-center px-6 py-4 text-left bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:border-cloudsfit-blue/50 transition-all text-white shadow-xl group"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-0.5">Selected Address</span>
                <span className="block truncate font-bold text-sm">
                  {selectedAddress
                    ? selectedAddress.address_1
                    : "Choose an existing address"}
                </span>
              </div>
              <ChevronUpDown
                className={clx("transition-transform duration-300 w-5 h-5 text-white/30 group-hover:text-cloudsfit-blue", {
                  "rotate-180": open,
                })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-[100] mt-2 w-full overflow-hidden bg-neutral-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none ring-1 ring-black ring-opacity-5"
            data-testid="shipping-address-options"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {addresses.map((address) => {
                const isSelected = selectedAddress?.id === address.id
                return (
                  <Listbox.Option
                    key={address.id}
                    value={address.id}
                    className={clx(
                      "cursor-pointer select-none relative px-6 py-4 transition-colors",
                      isSelected ? "bg-cloudsfit-blue/10" : "hover:bg-white/[0.03]"
                    )}
                    data-testid="shipping-address-option"
                  >
                    <div className="flex gap-x-4 items-start">
                      <div className={clx(
                        "w-4 h-4 rounded-full border flex items-center justify-center mt-1 transition-all",
                        isSelected ? "border-cloudsfit-blue" : "border-white/20"
                      )}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cloudsfit-blue" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-black uppercase tracking-tighter text-sm mb-1">
                          {address.first_name} {address.last_name}
                        </span>
                        <div className="flex flex-col text-xs text-white/50 space-y-0.5">
                          <span>{address.address_1}</span>
                          <span>{address.postal_code}, {address.city}</span>
                          <span className="text-cloudsfit-blue/70 font-bold uppercase tracking-widest text-[9px]">
                            {address.country_code?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Listbox.Option>
                )
              })}
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect

