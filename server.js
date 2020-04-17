const axios = require("axios")''
const express = require("express");
const next = require("next");
const { resolve } = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

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
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(String(term))}`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_MAP_API_KEY}`
            }
          }
        );
        res.status(200).json(data);
      } catch (error) {
        res.status(404).json({ message: `Search term "${term}" not found.` });
      }
    })



    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });