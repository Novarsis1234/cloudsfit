
import { MedusaContainer } from "@medusajs/framework/types"

export default async function testRazorpayInit({ container }: { container: MedusaContainer }) {
    const paymentModuleService = container.resolve("payment")
    const remoteQuery = container.resolve("remoteQuery")

    console.log("--- TESTING RAZORPAY INITIATION ---")

    try {
        // 1. Find a payment collection or create a dummy one
        const [collections] = await paymentModuleService.listAndCountPaymentCollections({}, { take: 1 })
        let collectionId = collections[0]?.id

        if (!collectionId) {
            console.log("No payment collection found, creating one...")
            const collection = await paymentModuleService.createPaymentCollections({
                currency_code: "inr",
                amount: 1000,
            })
            collectionId = collection.id
        }

        console.log(`Using Payment Collection: ${collectionId}`)

        // 2. Mock Cart Data
        const mockCart = {
            id: "cart_test_manual",
            items: [
                { id: "item_1", title: "Test Item", unit_price: 1000, quantity: 1 }
            ],
            totals: { total: 1000 },
            currency_code: "INR",
            email: "test@example.com",
            shipping_address: { phone: "9876543210", address_1: "Test Address" },
            billing_address: { phone: "9876543210" },
            customer: { id: "cus_test", email: "test@example.com" }
        }

        // 3. Attempt to create a Razorpay payment session
        console.log("Calling createPaymentSession with pp_razorpay_razorpay...")

        const sessionData = {
            provider_id: "pp_razorpay_razorpay",
            amount: 1000,
            currency_code: "inr",
            data: {
                extra: mockCart
            },
            context: {
                // The AbstractPaymentProvider.inituatePayment receives this context
                extra: mockCart,
                customer: mockCart.customer
            }
        }

        // @ts-ignore
        const session = await paymentModuleService.createPaymentSession(collectionId, sessionData)
        console.log("SUCCESS! Session created:", JSON.stringify(session, null, 2))

    } catch (err: any) {
        console.error("FAILED during initiation:")
        console.error("Message:", err.message)
        if (err.stack) {
            // Log only relevant parts of the stack to avoid noise
            console.error("Stack trace hint:", err.stack.split('\n').slice(0, 5).join('\n'))
        }
    }
}
