import { QueryTypes } from 'sequelize'
import db from '../config/db.js'
import dayjs from 'dayjs'
import { parse, isBefore } from 'date-fns'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import CatalogoTurnos from '../models/CatalogoTurnos.js'
import { queryChecks, querySolicitudesJustificantes } from '../constant/querys.js'

export const obtenerChecks = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body
    
    dayjs.extend(weekOfYear)
    const todoschecks = await db.query(queryChecks(fechaInicio, fechaFin),{type: QueryTypes.SELECT,})
    const todosSolicitudes = await db.query(querySolicitudesJustificantes(fechaInicio, fechaFin),{type: QueryTypes.SELECT,})
    const turnosEspeciales = await CatalogoTurnos.findAll({where:{ turnoEspecial: 1}})

    const checksMap = new Map();
    for (const check of todoschecks) {
      const semana = dayjs(check.fechaRegistro).week() // Obtener la semana del año
      const key = `${check.numero_empleado}-${semana}-${check.fechaRegistro}`
    
      if (!checksMap.has(key)) {
        checksMap.set(key, check)
      }
    }

    // Agrupar los resultados por numero_empleado y semanas
    const resultados = Array.from(checksMap.values()).reduce((acc, check) => {
      const usuarioId = check.numero_empleado
      const semana = dayjs(check.fechaRegistro).week() // Obtener la semana del año
      const turnoEspecialSemana = turnosEspeciales.filter(elemento => elemento.turno ===  check.turnoLunesViernes)
      const turnoEspecialSabado = turnosEspeciales.filter(elemento => elemento.turno ===  check.turnoSabados)

      if (!acc[usuarioId]) {
        acc[usuarioId] = {
            numero_empleado: check.numero_empleado,
            nombre: check.nombre,
            fechaAlta: check.fechaAlta,
            aniosLaborados: check.aniosLaborados,
            diasVacacionesLey: check.diasVacacionesLey,
            diasVacacionesRestantes: check.diasVacacionesRestantes,
            diasEconomicosLey: check.diasEconomicosLey,
            diasEconomicosRestantes: check.diasEconomicosRestantes,
            puesto: check.puesto,
            division: check.division,
            departamento: check.departamento,
            centroTrabajo: check.centroTrabajo,
            claveEmpresa: check.claveEmpresa,
            claveSucursal: check.claveSucursal,
            claveDepartamento: check.claveDepartamento,
            numeroEmpleadoJefe: check.numeroEmpleadoJefe,
            estatus: check.estatus,
            turnoLunesViernes: check.turnoLunesViernes,
            turnoSabados: check.turnoSabados,
            createdAt: check.createdAt,
            updatedAt: check.updatedAt,
            semanas: {}
        }
      }

      if (!acc[usuarioId].semanas[semana]) {
        acc[usuarioId].semanas[semana] = {
          lunes: {},
          martes: {},
          miercoles: {},
          jueves: {},
          viernes: {},
          sabado: {},
        }
      }

      if(check.fechaRegistro)
      {
        const fechaRegistro = check.fechaRegistro
        const diaSemana = dayjs(fechaRegistro).day() // 0 (Domingo) a 6 (Sábado)
        const horaRegistro = check.horaRegistro
        
        //Chequeo si es retardo
        let horaTurno 
        if(diaSemana === 6){
          horaTurno = parse(check.turnoSabados.replace('TURNO ', '').split(" - ")[0], 'HH:mm', new Date())
        }else{
          horaTurno = parse(check.turnoLunesViernes.replace('TURNO ', '').split(" - ")[0], 'HH:mm', new Date())
        }
  
        const horaEntrada = parse(check.horaRegistro, 'HH:mm', new Date())
        const retardo = isBefore(horaTurno, horaEntrada)
  
        switch (diaSemana) {
          case 1:
            acc[usuarioId].semanas[semana].lunes = { fechaRegistro, horaRegistro, retardo }
            break
          case 2:
            acc[usuarioId].semanas[semana].martes = { fechaRegistro, horaRegistro, retardo }
            break
          case 3:
            acc[usuarioId].semanas[semana].miercoles = { fechaRegistro, horaRegistro, retardo }
            break
          case 4:
            acc[usuarioId].semanas[semana].jueves = { fechaRegistro, horaRegistro, retardo }
            break
          case 5:
            acc[usuarioId].semanas[semana].viernes = { fechaRegistro, horaRegistro, retardo }
            break
          case 6:
            acc[usuarioId].semanas[semana].sabado = { fechaRegistro, horaRegistro, retardo }
            break
          default:
            break
        }
      }
      
      acc[usuarioId].turnoEspecialSemana = turnoEspecialSemana[0]
      acc[usuarioId].turnoEspecialSabado = turnoEspecialSabado[0]
      
      return acc
    }, {})

    // Agregar solicitudes a los días correspondientes
      todosSolicitudes.forEach((solicitud) => {
        const usuarioId = solicitud.numero_empleado
        const fechaSolicitud = solicitud.fechaDiaSolicitado
        const semana = dayjs(fechaSolicitud).week()
        const diaSemana = dayjs(fechaSolicitud).day() // 0 (Domingo) a 6 (Sábado)
        //Si no existe usuario en arreglo lo crea
        if (!resultados[usuarioId]) {
          resultados[usuarioId] = {
            numero_empleado: solicitud.numero_empleado,
            nombre: solicitud.nombre,
            fechaAlta: solicitud.fechaAlta,
            aniosLaborados: solicitud.aniosLaborados,
            diasVacacionesLey: solicitud.diasVacacionesLey,
            diasVacacionesRestantes: solicitud.diasVacacionesRestantes,
            diasEconomicosLey: solicitud.diasEconomicosLey,
            diasEconomicosRestantes: solicitud.diasEconomicosRestantes,
            puesto: solicitud.puesto,
            division: solicitud.division,
            departamento: solicitud.departamento,
            centroTrabajo: solicitud.centroTrabajo,
            claveSucursal: solicitud.claveSucursal,
            numeroEmpleadoJefe: solicitud.numeroEmpleadoJefe,
            estatus: solicitud.estatus,
            turnoLunesViernes: solicitud.turnoLunesViernes,
            turnoSabados: solicitud.turnoSabados,
            createdAt: solicitud.createdAt,
            updatedAt: solicitud.updatedAt,
            semanas: {}
          }
        }
        //Si no existe la semana lo crea
        if (!resultados[usuarioId].semanas[semana]) {
          resultados[usuarioId].semanas[semana] = {
            lunes: {},
            martes: {},
            miercoles: {},
            jueves: {},
            viernes: {},
            sabado: {},
          }
        }

        //Si no existe el dia lo crea
        const dia = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][diaSemana]
        if (!resultados[usuarioId].semanas[semana][dia]) {
          resultados[usuarioId].semanas[semana][dia] = {}
        }
        resultados[usuarioId].semanas[semana][dia].solicitud = solicitud
      })

    const arrayResultados = Object.values(resultados)

    return res.json(arrayResultados)
  } catch (error) {
    return res.status(500).json({ message: "Error en el sistema.(" + error.message + ")" })
  }
}

