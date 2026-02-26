import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { convertToLocale } from "@/lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0
  let count = 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  const billingAddress = customer.addresses?.find((addr) => addr.is_default_billing)
  if (billingAddress) count++
  return (count / 4) * 100
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const profileCompletion = getProfileCompletion(customer)

  return (
    <div className="flex flex-col gap-y-8" data-testid="overview-page-wrapper">
      {/* Welcome Header */}
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white" data-testid="welcome-message" data-value={customer?.first_name}>
            Hey, {customer?.first_name} 👋
          </h1>
        </div>
        <p className="text-white/40 text-sm" data-testid="customer-email" data-value={customer?.email}>
          {customer?.email}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Profile Completion */}
        <div className="bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
          <LocalizedClientLink href="/account/profile">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3 block">Profile</span>
            <div className="flex items-end gap-x-2 mb-3">
              <span
                className="text-4xl font-black text-white tracking-tighter"
                data-testid="customer-profile-completion"
                data-value={profileCompletion}
              >
                {profileCompletion}%
              </span>
              <span className="text-white/40 text-xs uppercase tracking-widest mb-1">Completed</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cloudsfit-purple to-cloudsfit-blue rounded-full transition-all duration-700"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </LocalizedClientLink>
        </div>

        {/* Addresses */}
        <div className="bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
          <LocalizedClientLink href="/account/addresses">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3 block">Addresses</span>
            <div className="flex items-end gap-x-2">
              <span
                className="text-4xl font-black text-white tracking-tighter"
                data-testid="addresses-count"
                data-value={customer?.addresses?.length || 0}
              >
                {customer?.addresses?.length || 0}
              </span>
              <span className="text-white/40 text-xs uppercase tracking-widest mb-1">Saved</span>
            </div>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tighter text-white">Recent Orders</h2>
          <LocalizedClientLink
            href="/account/orders"
            className="text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:text-cloudsfit-blue/70 transition-colors"
          >
            View all →
          </LocalizedClientLink>
        </div>

        <ul className="flex flex-col gap-y-3" data-testid="orders-wrapper">
          {orders && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                  <div className="bg-neutral-950/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-all group">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-white font-black text-base tracking-tighter" data-testid="order-id" data-value={order.display_id}>
                        Order #{order.display_id}
                      </span>
                      <div className="flex items-center gap-x-3 text-xs text-white/40 font-bold uppercase tracking-widest">
                        <span data-testid="order-created-date">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span data-testid="order-amount" className="text-white/60">
                          {convertToLocale({
                            amount: order.total,
                            currency_code: order.currency_code,
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-cloudsfit-blue/40 group-hover:text-cloudsfit-blue transition-colors text-lg">→</span>
                  </div>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li>
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-8 flex flex-col items-center gap-y-3 text-center">
                <span className="text-3xl">📦</span>
                <span className="text-white/40 text-sm" data-testid="no-orders-message">No orders yet</span>
                <LocalizedClientLink
                  href="/"
                  className="text-xs font-bold uppercase tracking-widest text-cloudsfit-blue hover:text-cloudsfit-blue/70 transition-colors"
                >
                  Start shopping →
                </LocalizedClientLink>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Overview
