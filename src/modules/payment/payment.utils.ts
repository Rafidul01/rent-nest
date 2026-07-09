import { Stripe } from "stripe";
import { prisma } from "../../lib/prisma";

export const stripeCheackoutComplit = async (session: Stripe.Checkout.Session) => {
    const transactionId = session.metadata?.transactionId;   
    if (!transactionId) {
        console.log("no transaction id");
        return;
    }

    await makePayment(transactionId, session);
};

const makePayment = async (transactionId: string, session: Stripe.Checkout.Session) => {
    await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({
            where: { transactionId },
            include: { rentalRequest: true }
        });

        if (!payment) {
            console.log("payment not found");
            return;
        }
        if (payment.status === "COMPLETED") {
            console.log("payment already paid");
            return;
        }

        const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        await tx.payment.update({
            where: { id: payment.id },
            data: {
                status: "COMPLETED",
                paidAt: new Date(),
                stripePaymentIntentId: paymentIntentId
            }
        });

        await tx.rentalRequest.update({
            where: { id: payment.rentalRequest.id },
            data: { status: "ACTIVE" }
        });
    });
};

export const handleStripeCheckoutExpired = async (session: Stripe.Checkout.Session) => {
    const transactionId = session.metadata?.transactionId;   
    if (!transactionId) {
        console.log("no transaction id");
        return;
    }

    await prisma.payment.update({
        where: {
            transactionId,
            status: "PENDING"
        },
        data: { status: "FAILED" }
    });
};