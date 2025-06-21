import puppeteer from "puppeteer";
import fs from "fs";
async function obtenerDatosAngular() {
  const navegador = await puppeteer.launch({
    headless: false,
    slowMo: 300,
  });

  const pagina = await navegador.newPage();

  await pagina.goto("https://blog.angular.dev", { waitUntil: "networkidle2" });

  const datos = await pagina.evaluate(() => {
    const resultados = [];
    const articulos = document.querySelectorAll("main article");

    articulos.forEach((articulo) => {
      const titulo = articulo.querySelector("h2")?.innerText;
      const autor = articulo.querySelector("p")?.innerText;
      const fecha = articulo.querySelector("div.o.p.mn>span")?.innerText;
      const avatar = articulo.querySelector("img")?.src || "";
      const likes = articulo.querySelector(
        "div.o.p.mp>span:nth-child(2)"
      )?.innerText;
      const comentarios = articulo.querySelector(
        "div.do.mj.mk.o.p > a > div:nth-child(2) > div.o > div.dd > div.o.p.mp > span"
      )?.innerText;
      resultados.push({
        titulo,
        fecha,
        perfil: {
          autor: autor,
          avatar: avatar,
        },
        reacciones: {
          likes: likes,
          comentarios: comentarios,
        },
      });
    });

    return resultados;
  });

  fs.writeFileSync("Articulos.json", JSON.stringify(datos, null, 2));
  console.log(JSON.stringify(datos, null, 2));
  console.log("✅ Archivo generado: Articulos.json");

  await navegador.close();
}

obtenerDatosAngular();