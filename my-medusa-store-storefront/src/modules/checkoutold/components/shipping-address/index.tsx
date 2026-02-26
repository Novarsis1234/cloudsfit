import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import Checkbox from "@/modules/common/components/checkbox"
import Input from "@/modules/common/components/input"
import React, { useEffect, useState } from "react"
import AddressSelect from "../address-select"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "in",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "in",
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    if (cart && cart.shipping_address) {
      setFormAddress(cart.shipping_address, cart.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart, customer])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-y-6">
      {customer && (customer.addresses?.length || 0) > 0 && (
        <div className="mb-6 bg-white/5 rounded-2xl p-6 border border-white/5 shadow-inner">
          <Text className="text-xs text-white/50 uppercase tracking-widest font-bold mb-4 ml-1">Saved Addresses</Text>
          <AddressSelect addresses={customer.addresses} cart={cart} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
      </div>

      <Input
        label="Address"
        name="shipping_address.address_1"
        autoComplete="address-line1"
        value={formData["shipping_address.address_1"]}
        onChange={handleChange}
        required
        className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
      />

      <Input
        label="Company"
        name="shipping_address.company"
        autoComplete="organization"
        value={formData["shipping_address.company"]}
        onChange={handleChange}
        className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
        <Input
          label="City"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="State / Province"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
        <div className="flex flex-col gap-y-2">
          <Text className="text-xs text-white/30 uppercase tracking-widest font-bold ml-1">Country</Text>
          <div className="px-4 py-4 bg-neutral-900/80 border border-white/10 rounded-xl text-white font-black uppercase tracking-tighter cursor-not-allowed flex items-center justify-between shadow-lg">
            India
            <span className="text-[10px] bg-cloudsfit-blue/20 px-2 py-1 rounded text-cloudsfit-blue tracking-widest uppercase font-bold">In-Region</span>
          </div>
          <input type="hidden" name="shipping_address.country_code" value="in" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          className="bg-black/40 border-white/10 text-white rounded-xl focus:border-cloudsfit-blue/50"
        />
      </div>

      <div className="mt-4 px-6 py-4 bg-cloudsfit-blue/5 border border-cloudsfit-blue/20 rounded-2xl flex items-center transition-all hover:bg-cloudsfit-blue/10">
        <Checkbox
          name="same_as_billing"
          label="Billing address same as shipping address"
          checked={checked}
          onChange={onChange}
          className="text-cloudsfit-blue border-white/20 bg-black/40"
        />
      </div>
    </div>
  )
}

export default ShippingAddress
