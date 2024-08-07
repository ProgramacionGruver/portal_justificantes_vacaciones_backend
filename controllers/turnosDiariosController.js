import puppeteer from 'puppeteer'
import randomUserAgent from 'random-useragent'
import dayjs from 'dayjs'
import { enviarCorreoErrores } from '../helpers/correosErrores.js'
import ChecksDiarios from '../models/ChecksDiarios.js'

export const obtenerResultadosDiarios = async (req, res) => {
    //const navegador = await puppeteer.launch({ headless: false })
    const navegador = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']})
    let seccionError = 'Creacion de web'
    try {
        const cabezera = randomUserAgent.getRandom()
        const pagina = await navegador.newPage()

        await pagina.setUserAgent(cabezera)
        await pagina.setViewport({ width: 1220, height: 1080 })

        await pagina.goto('https://erp.biocheck.net/web/login', { timeout: 0 })

        //========CREAR LOGIN=================================================
        seccionError = 'Login error.'
        /**Login*/
        const loginInput = await pagina.waitForSelector('input[name="login"]')
        await loginInput.type('sgruver@gruver.mx')
        /**Password*/
        const passwordInput = await pagina.waitForSelector('input[name="password"]')
        await passwordInput.type('Monitor')
        /**btn IniciarSesion*/
        await pagina.click('.btn-block')

        //========PAGINA PRINCIPAL BIOCHECK====================   
        seccionError = 'Principal biocheck error.'
        await new Promise(resolve => setTimeout(resolve, 15000))
        /**Seleccionar reportes */
        await pagina.goto('https://erp.biocheck.net/web#menu_id=232&action=287&cids=116')
        await new Promise(resolve => setTimeout(resolve, 10000))
        seccionError = 'LLenado biocheck reporte error.'
        /**seleccionar checks select */
        await pagina.evaluate(() => {
            const selectElement = document.querySelector('select[name="report"]');
            selectElement.value = '"checks"';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        })
        /**seleccionar HTML select */
        await pagina.evaluate(() => {
            const selectElement = document.querySelector('select[name="report_type"]')
            selectElement.value = '"html"'
            selectElement.dispatchEvent(new Event('change', { bubbles: true }))
        })
        
        /**seleccionar fecha inicio select */
        const fechaInico = await pagina.waitForSelector('input[name="date_from"]')
        const fechaInicioFormat = dayjs().format("DD/MM/YYYY")
        await fechaInico.type(fechaInicioFormat)
        /**seleccionar fecha inicio fin */
        const fechaFin = await pagina.waitForSelector('input[name="date_to"]')
        const fechaFinalFormat = dayjs().format("DD/MM/YYYY")
        await fechaFin.type(fechaFinalFormat)
        /**obtener reporte*/
        await pagina.click('button[name="get_report"]')
        await new Promise(resolve => setTimeout(resolve, 25000))
        /**cerrar advertencia*/
        // await pagina.click('.close')

        //========OBTENER TABLA Y OBTENER DATA====================   
        seccionError = 'obtener data table error.'
        const iframe = await pagina.waitForSelector('.o_report_iframe')
        const frameHandle = await iframe.contentFrame()
        await frameHandle.waitForSelector('.table-condensed')

        // Obtener todas las filas de la tabla
        const tbody = await frameHandle.waitForSelector('tbody')

        // Obtener todas las filas del tbody
        const rows = await tbody.$$('tr')

        // Iterar a través de las filas
        seccionError = 'Destructuring error.'

        const tableData = [];
        const batchSize = 20; // Procesar 5 filas a la vez

        for (let i = 0; i < rows.length; i += batchSize) {
          const batchRows = rows.slice(i, i + batchSize);
          const batchData = await Promise.all(batchRows.map(async (row, index) => {
            const celdas = await row.$$('td');
            const data = await Promise.all(celdas.map(async (cell) => {
              const content = await cell.evaluate((node) => node.textContent)
              return content.trim();
            }))
            return {
              numero_empleado: data[0],
              fechaRegistro: convertirFormatoFecha(data[2]),
              horaRegistro: data[3],
            }
          }))
          tableData.push(...batchData)
        await new Promise(resolve => setTimeout(resolve, 2000))
        }
        await navegador.close()
        await ChecksDiarios.bulkCreate(tableData)
        return
    } catch (error) {
        await navegador.close()
        await enviarCorreoErrores(`[${seccionError}] / [${error}]`)
    }
}

const convertirFormatoFecha = (fechaStr) => {
  const [dia, mes, anio] = fechaStr.split('/')
  const fechaFormateada = `${anio}-${mes}-${dia}`
  return fechaFormateada
}