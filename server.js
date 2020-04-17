const axios = require("axios");
const bodyParser = require("body-parser");
const compression = require("compression");
const crypto = require("crypto");
const express = require("express");
const next = require("next");
const { resolve } = require("path");
const webpush = require("web-push");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const subscriptions = {};

const vapidKeys = {
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
  publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
};

webpush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL_ADDRESS}`,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const createHash = (input) => {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
};

const handlePushNotificationSubscription = (req, res) => {
  const subscriptionRequest = req.body;
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
  subscriptions[susbscriptionId] = subscriptionRequest;
  res.status(201).json({ id: susbscriptionId });
};

const sendPushNotification = (req, res) => {
  const subscriptionId = req.params.id;
  const pushSubscription = subscriptions[subscriptionId];
  const pushTitle = "마스크 입고 알림";
  const pushText = `찜해두신 판매점에 마스크가 들어왔습니다`;

  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: pushTitle,
        text: pushText,
        image: "/icons/icon-192x192.png",
        tag: "알림",
        url: "/",
      })
    )
    .catch((err) => {
      console.log(err);
    });

  res.status(202).json({});
};

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(compression());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());

    server.post("/subscription", handlePushNotificationSubscription);

    server.get("/subscription/:id", sendPushNotification);

    server.get("/sw.js", (req, res) => {
      app.serveStatic(req, res, resolve("./public/service-worker.js"));
    });

    server.get("/api/search", async (req, res) => {
      const { term } = req.query;

      try {
        if (!term) {
          return;
        }
        const { data } = await axios.get(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
            String(term)
          )}`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_MAP_API_KEY}`,
            },
          }
        );
        res.status(200).json(data);
      } catch (error) {
        res.status(404).json({ message: `Search term "${term}" not found.` });
      }
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
