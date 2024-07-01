import puppeteer from 'puppeteer'
import randomUserAgent from 'random-useragent'
import dayjs from 'dayjs'
import Usuarios from '../models/Usuarios.js'

export const obtenerTurnoEmpleado = async (req, res) => {
    const navegador =  await puppeteer.launch({ headless: false })
    //const navegador = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser' })
    let seccionError = 'Creacion de web'
    try {
        const cabezera = randomUserAgent.getRandom()
        const pagina = await navegador.newPage()

        await pagina.setUserAgent(cabezera)
        await pagina.setViewport({ width: 1220, height: 1080 })

        await pagina.goto('https://erp.biocheck.net/web/login', { timeout: 0 })

        //========CREAR LOGIN=================================================
        seccionError = 'Login error.'
        await new Promise(resolve => setTimeout(resolve, 10000))
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
        await new Promise(resolve => setTimeout(resolve, 10000))
        /**Seleccionar reportes */
        await pagina.goto('https://erp.biocheck.net/web#menu_id=232&action=287&cids=116')
        await new Promise(resolve => setTimeout(resolve, 10000))
        seccionError = 'LLenado biocheck reporte error.'
        /**seleccionar HTML select */
        await pagina.waitForSelector('select[name="report_type"]');
        await pagina.evaluate(() => {
            const selectElement = document.querySelector('select[name="report_type"]');
            selectElement.value = '"html"';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        const fechaInputInicio = dayjs().format("DD/MM/YYYY")
        const fechaInputFin = dayjs().format("DD/MM/YYYY")

        // Parsear la fecha y saber si es sabado
        const fecha = dayjs(fechaInputInicio, "DD/MM/YYYY")
        const esSabado = fecha.day() === 6

        /**seleccionar fecha inicio select */
        const fechaInico = await pagina.waitForSelector('input[name="date_from"]')
        await fechaInico.type(fechaInputInicio)
        /**seleccionar fecha inicio fin */
        const fechaFin = await pagina.waitForSelector('input[name="date_to"]')
        await fechaFin.type(fechaInputFin)
        /**obtener reporte*/
        await pagina.click('button[name="get_report"]')
        await new Promise(resolve => setTimeout(resolve, 15000))
        /**cerrar advertencia*/
        //await pagina.click('.close')

        //========OBTENER TABLA Y OBTENER DATA====================   
        seccionError = 'obtener data table error.'
        const iframe = await pagina.waitForSelector('.o_report_iframe')
        const frameHandle = await iframe.contentFrame()
        await frameHandle.waitForSelector('.table-condensed')

        // Obtener todas las filas de la tabla
        const tbody = await frameHandle.waitForSelector('tbody')

        // Obtener todas las filas del tbody
        const rows = await tbody.$$('tr')
        rows.pop()

        // Iterar a través de las filas
        seccionError = 'Destructuring error.'
        const tableData = []
        const noLotes = 350
        const empleadosUnicos = new Set();

        const data = await Usuarios.findAll()

        for (let i = 0;i < rows.length;i += noLotes) {
            const lotesRows = rows.slice(i, i + noLotes)

            const batchData = await Promise.all(lotesRows.map(async (row, index) => {
                const celdas = await row.$$('td')
                const dataCelda = await Promise.all(celdas.map(async (cell) => {
                    const content = await cell.evaluate((node) => node.textContent)
                    return content.trim()
                }))
                
            return {
                numero_empleado: dataCelda[0],
                turno: dataCelda[4].replace('TURNO ', ''),
            }
               
            }))
            
            // Filtrar y agregar datos únicos a tableData
            const uniqueBatchData = batchData.filter(batchItem => {
                if (!empleadosUnicos.has(batchItem.numero_empleado)) {
                    empleadosUnicos.add(batchItem.numero_empleado)
                    return true
                }
                return false
            })

            tableData.push(...uniqueBatchData)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

    // Usar map en lugar de forEach
    for (const usuario of tableData) {
        if(!esSabado){
            await Usuarios.update({ turnoLunesViernes: usuario.turno }, { where: { numero_empleado: usuario.numero_empleado } });
        }else{
            await Usuarios.update({ turnoSabados: usuario.turno }, { where: { numero_empleado: usuario.numero_empleado } });
        }
    }

    await navegador.close()

    } catch (error) {
        await navegador.close()
        enviarCorreoErrores(`[${seccionError}] / [${error}]`)
        throw new Error()
    }
}