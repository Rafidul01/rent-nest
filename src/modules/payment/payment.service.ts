import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { IPaymentPayload } from "./payment.interface";
import { randomUUID } from "crypto";
import { handleStripeCheckoutExpired, stripeCheackoutComplit } from "./payment.utils";
import { Stripe } from "stripe";
const createPayment = async (id: string, payload: IPaymentPayload) => {
  const { requestId } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === "BANNED") {
    throw new Error("User is banned");
  }
  if (user.role !== "TENANT") {
    throw new Error("Only tenants can make payments");
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.tenantId !== id) {
    throw new Error(
      "You are not authorized to make payments for this rental request",
    );
  }
  if (rentalRequest.status !== "APPROVED") {
    throw new Error("Rental request is not approved");
  }

  const newTransactionId = `RENTNEXT-${randomUUID()}`;

  const payment = await prisma.payment.upsert({
    where: {
      rentalRequestId: requestId,
    },
    update: {
      transactionId: newTransactionId,
      amount: rentalRequest.totalAmount,
      status: "PENDING",
    },
    create: {
      transactionId: newTransactionId,
      amount: rentalRequest.totalAmount,
      status: "PENDING",
      rentalRequestId: requestId,
      userId: id,
    },
  });

  let paymentURL: string | null = null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Rent Nest ${rentalRequest.propertyId}`,
          },
          unit_amount: Math.round(Number(rentalRequest.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.app_url}/payment/success/${newTransactionId}`,
    cancel_url: `${config.app_url}/payment/cancel/${newTransactionId}`,
    metadata: {
      requestId,
      transactionId: newTransactionId,
      tenantId: id,
      paymentId: payment.id,
    },
  });

  if (!session) {
    throw new Error("Payment failed");
  }

  paymentURL = session.url;

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      stripeSessionId: session.id,
    },
  });

  return { paymentURL, newTransactionId };
};

const confirmPayment = async (signature: string, payload: Buffer) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await stripeCheackoutComplit(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    case "checkout.session.expired":
      await handleStripeCheckoutExpired(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    default:
      console.log(`Unhandled stripe event type ${event.type}`);
      break;
  }
};

const getPaymentHistory = async (id: string) => {
  return await prisma.payment.findMany({
    where: {
      userId: id,
    },
    include: {
      rentalRequest: true,
    },
  });
  
};

const getSinglePayment = async (id: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      rentalRequest: true,
    },
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (payment.userId !== userId) {
    throw new Error("You are not authorized to view this payment");
  }
  return await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      rentalRequest: true,
    },
  })
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getPaymentHistory,
  getSinglePayment
};
