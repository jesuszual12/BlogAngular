import puppeteer from "puppeteer";
import fs from "fs";
import * as XLSX from "xlsx";

async function obtenerDatosAngular() {
  const navegador = await puppeteer.launch({
    headless: false,
    slowMo: 300,
  });

  const pagina = await navegador.newPage();

  await pagina.goto("https://blog.angular.dev", {
    waitUntil: "networkidle2",
   
  });

  // Asegura que el contenido esté cargado
  await pagina.waitForSelector("main article");

  const datos = await pagina.evaluate(() => {
    const resultados = [];
    const articulos = document.querySelectorAll("main article");

    articulos.forEach((articulo) => {
      const titulo = articulo.querySelector("h2")?.innerText;
      const autor = articulo.querySelector("p")?.innerText;
      const fecha = articulo.querySelector("div.o.p.mn>span")?.innerText;
      const avatar = articulo.querySelector("img")?.src || "";
      const likes = articulo.querySelector("div.o.p.mp>span:nth-child(2)")?.innerText;
      const comentarios = articulo.querySelector("div.do.mj.mk.o.p > a > div:nth-child(2) > div.o > div.dd > div.o.p.mp > span")?.innerText;

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
  //  JSON
  console.log("✅ Artículos extraídos:", datos.length);
  console.log(JSON.stringify(datos, null, 2));
  fs.writeFileSync("Articulos.json", JSON.stringify(datos, null, 2));
  console.log("✅ Archivo generado: Articulos.json");

  // CSV
  const csvData = [
    ["Titulo", "Fecha", "Autor", "Avatar", "Likes", "Comentarios"],
    ...datos.map((item) => [
      `"${item.titulo}"`,
      `"${item.fecha}"`,
      `"${item.perfil.autor}"`,
      `"${item.perfil.avatar}"`,
      `"${item.reacciones.likes}"`,
      `"${item.reacciones.comentarios}"`,
    ]),
  ]
    .map((fila) => fila.join(","))
    .join("\n");

  fs.writeFileSync("Articulos.csv", csvData);
  console.log("✅ Archivo generado: Articulos.csv");

  //  Excel
  const datosPlano = datos.map((item) => ({
  titulo: item.titulo,
  fecha: item.fecha,
  autor: item.perfil.autor,
  avatar: item.perfil.avatar,
  likes: item.reacciones.likes,
  comentarios: item.reacciones.comentarios,
}));


const path = "Articulos.xlsx";
if (fs.existsSync(path)) {
  try {
    fs.unlinkSync(path);
    console.log("");
  } catch (err) {
    console.error("no se elimino el archivo pasado", err.message);
    return;
  }
}


try {
  const hoja = XLSX.utils.json_to_sheet(datosPlano);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Artículos");
  XLSX.writeFile(libro, "Articulos.xlsx");
  console.log("✅ Archivo generado: Articulos.xlsx");
} catch (err) {
  console.error("❌ Error al guardar Articulos.xlsx:", err.message);
}
await navegador.close();
  console.log("✅ Navegador cerrado");

}
 

obtenerDatosAngular();
