# Web Scraper para el Blog de Angular

Hola, somos José de Jesús Zúñiga Alarcón y Kevin Jesús Badillo Díaz. En este proyecto desarrollamos un scraper para extraer información de los artículos publicados en el blog oficial de Angular (https://blog.angular.dev). Usamos Puppeteer para automatizar la navegación y obtener datos como el título, fecha, autor, avatar, likes y comentarios de cada artículo.

Guardamos toda la información en tres formatos: JSON, CSV y Excel, para que sea más fácil analizarla o usarla en otros proyectos.

---

## Requisitos

- Tener instalado Node.js (recomendamos versión 18 o superior)  
- Conexión a internet estable  
- Permisos para crear y modificar archivos en la carpeta donde ejecutes el proyecto  

---

## Instalación

Para instalar las dependencias que usamos, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm init -y
npm install puppeteer xlsx
