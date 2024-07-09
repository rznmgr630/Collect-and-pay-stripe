const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51PO2EnP4w5OMCT8Ul8QTVgoKxtqeHaWj3Tc671D2J1pLzh9RPQRu2CaJNthkXdxaEokFc0a6jHBZfTK8tRreKoqm00uscvzT8c"
);
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Endpoint to create a connected account
app.post("/create-connected-account", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
    });
    res.json({ accountId: account.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint to create an account link
app.post("/create-account-link", async (req, res) => {
  const { accountId } = req.body;

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });
    res.json({ url: accountLink.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint to create a checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { priceId, connectedAccountId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Learn React",
            },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {
          destination: connectedAccountId,
        },
      },
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint to handle Stripe webhook events
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "your_webhook_signing_secret"
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        // Fulfill the purchase...
        break;
      // Other event types...
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
