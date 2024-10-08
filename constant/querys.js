export const queryUsuarios = {
    obtenerUsuariosProgramadores: "SELECT numero_empleado FROM [portal_sistemas].[dbo].[usuarios] WHERE (puesto LIKE 'PROGRAMADOR%' OR puesto LIKE 'AUXILIAR DE SISTEMAS') AND estatus = 1",
}

export const queryChecks = (fechaInicio, fechaFin) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      usuarios.createdAt,
      usuarios.updatedAt,
      checks.fechaRegistro,
      checks.horaRegistro
      FROM [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios 
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[checksDiarios] AS checks ON usuarios.numero_empleado = checks.numero_empleado 
      AND	checks.fechaRegistro BETWEEN '${fechaInicio}' AND '${fechaFin}'
      WHERE usuarios.numero_empleado > 2 AND usuarios.estatus = 1
      ORDER BY usuarios.numero_empleado, checks.fechaRegistro ASC, checks.horaRegistro
 `
}

export const queryChecksEmpresa = (fechaInicio, fechaFin, claveEmpresa) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      usuarios.createdAt,
      usuarios.updatedAt,
      checks.fechaRegistro,
      checks.horaRegistro
      FROM [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios 
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[checksDiarios] AS checks ON usuarios.numero_empleado = checks.numero_empleado 
      AND	checks.fechaRegistro BETWEEN '${fechaInicio}' AND '${fechaFin}'
      WHERE usuarios.numero_empleado > 2 AND usuarios.estatus = 1 AND usuarios.claveEmpresa = '${claveEmpresa}'
      ORDER BY usuarios.numero_empleado, checks.fechaRegistro ASC, checks.horaRegistro
 `
}

export const queryChecksUsuario = (fechaInicio, fechaFin, numero_empleado) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      usuarios.createdAt,
      usuarios.updatedAt,
      checks.fechaRegistro,
      checks.horaRegistro
      FROM [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios 
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[checksDiarios] AS checks ON usuarios.numero_empleado = checks.numero_empleado 
      AND	checks.fechaRegistro BETWEEN '${fechaInicio}' AND '${fechaFin}'
      WHERE usuarios.numero_empleado = ${numero_empleado}
      ORDER BY usuarios.numero_empleado, checks.fechaRegistro ASC, checks.horaRegistro
 `
}

export const querySolicitudesJustificantes = (fechaInicio, fechaFin) => {
  return `
      SELECT
          solicitudes.folio,
          solicitudes.idTipoSolicitud,
          tipoSolicitud.nombreSolicitud,
          solicitudes.numero_empleado,
          solicitudes.claveEmpresa,
          solicitudes.claveSucursal,
          solicitudes.claveDepartamento,
          solicitudes.idMotivo,
          motivos.nombreMotivo,
          solicitudes.descripcionMotivo,
          solicitudes.createdAt,
          solicitudes.updatedAt,
          solicitudDetalle.fechaDiaSolicitado,
          solicitudDetalle.horaDiaSolicitado,
          solicitudDetalle.idEstatusSolicitud,
					usuarios.nombre,
					usuarios.fechaAlta,
					usuarios.aniosLaborados,
					usuarios.diasVacacionesLey,
					usuarios.diasVacacionesRestantes,
					usuarios.diasEconomicosLey,
					usuarios.diasEconomicosRestantes,
					usuarios.puesto,
					usuarios.division,
					usuarios.departamento,
					usuarios.centroTrabajo,
					usuarios.claveSucursal,
					usuarios.numeroEmpleadoJefe,
					usuarios.estatus,
					usuarios.turnoLunesViernes,
					usuarios.turnoSabados,
					aut1.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza1,
					aut1.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza1,
					aut1.fechaAutorizacion AS fechaAutorizacion1,
					aut1.nombreEstatus AS nombreEstatus1,
					aut2.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza2,
					aut2.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza2,
					aut2.fechaAutorizacion AS fechaAutorizacion2,
					aut2.nombreEstatus AS nombreEstatus2
      FROM [portal_justificantes_vacaciones].[dbo].[solicitudes] AS solicitudes
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[solicitud_detalle] AS solicitudDetalle ON solicitudes.folio = solicitudDetalle.folio
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_tipo_solicitudes] AS tipoSolicitud ON tipoSolicitud.idTipoSolicitud = solicitudes.idTipoSolicitud
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_motivos] AS motivos ON motivos.idMotivo = solicitudes.idMotivo
			LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = solicitudes.numero_empleado
			LEFT JOIN 
    (SELECT
         a1.idSolicitudDetalle,
         a1.numeroEmpleadoAutoriza,
         a1.nombreEmpleadoAutoriza,
         a1.createdAt AS fechaAutorizacion,
         e1.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a1.idSolicitudDetalle ORDER BY a1.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a1
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e1 ON e1.idEstatusSolicitud = a1.idEstatusAutorizacion
    ) AS aut1 ON aut1.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut1.rn = 1
LEFT JOIN 
    (SELECT
         a2.idSolicitudDetalle,
         a2.numeroEmpleadoAutoriza,
         a2.nombreEmpleadoAutoriza,
         a2.createdAt AS fechaAutorizacion,
         e2.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a2.idSolicitudDetalle ORDER BY a2.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a2
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e2 ON e2.idEstatusSolicitud = a2.idEstatusAutorizacion
    ) AS aut2 ON aut2.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut2.rn = 2
      WHERE solicitudDetalle.fechaDiaSolicitado BETWEEN '${fechaInicio}' AND '${fechaFin}'
      AND solicitudDetalle.idEstatusSolicitud = 2
 `
}

export const querySolicitudesJustificantesEmpresa = (fechaInicio, fechaFin, claveEmpresa) => {
  return `
      SELECT
          solicitudes.folio,
          solicitudes.idTipoSolicitud,
          tipoSolicitud.nombreSolicitud,
          solicitudes.numero_empleado,
          solicitudes.claveEmpresa,
          solicitudes.claveSucursal,
          solicitudes.claveDepartamento,
          solicitudes.idMotivo,
          motivos.nombreMotivo,
          solicitudes.descripcionMotivo,
          solicitudes.createdAt,
          solicitudes.updatedAt,
          solicitudDetalle.fechaDiaSolicitado,
          solicitudDetalle.horaDiaSolicitado,
          solicitudDetalle.idEstatusSolicitud,
					usuarios.nombre,
					usuarios.fechaAlta,
					usuarios.aniosLaborados,
					usuarios.diasVacacionesLey,
					usuarios.diasVacacionesRestantes,
					usuarios.diasEconomicosLey,
					usuarios.diasEconomicosRestantes,
					usuarios.puesto,
					usuarios.division,
					usuarios.departamento,
					usuarios.centroTrabajo,
					usuarios.claveSucursal,
					usuarios.numeroEmpleadoJefe,
					usuarios.estatus,
					usuarios.turnoLunesViernes,
					usuarios.turnoSabados,
					aut1.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza1,
					aut1.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza1,
					aut1.fechaAutorizacion AS fechaAutorizacion1,
					aut1.nombreEstatus AS nombreEstatus1,
					aut2.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza2,
					aut2.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza2,
					aut2.fechaAutorizacion AS fechaAutorizacion2,
					aut2.nombreEstatus AS nombreEstatus2
      FROM [portal_justificantes_vacaciones].[dbo].[solicitudes] AS solicitudes
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[solicitud_detalle] AS solicitudDetalle ON solicitudes.folio = solicitudDetalle.folio
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_tipo_solicitudes] AS tipoSolicitud ON tipoSolicitud.idTipoSolicitud = solicitudes.idTipoSolicitud
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_motivos] AS motivos ON motivos.idMotivo = solicitudes.idMotivo
			LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = solicitudes.numero_empleado
			LEFT JOIN 
    (SELECT
         a1.idSolicitudDetalle,
         a1.numeroEmpleadoAutoriza,
         a1.nombreEmpleadoAutoriza,
         a1.createdAt AS fechaAutorizacion,
         e1.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a1.idSolicitudDetalle ORDER BY a1.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a1
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e1 ON e1.idEstatusSolicitud = a1.idEstatusAutorizacion
    ) AS aut1 ON aut1.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut1.rn = 1
LEFT JOIN 
    (SELECT
         a2.idSolicitudDetalle,
         a2.numeroEmpleadoAutoriza,
         a2.nombreEmpleadoAutoriza,
         a2.createdAt AS fechaAutorizacion,
         e2.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a2.idSolicitudDetalle ORDER BY a2.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a2
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e2 ON e2.idEstatusSolicitud = a2.idEstatusAutorizacion
    ) AS aut2 ON aut2.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut2.rn = 2
      WHERE solicitudDetalle.fechaDiaSolicitado BETWEEN '${fechaInicio}' AND '${fechaFin}'
      AND solicitudDetalle.idEstatusSolicitud = 2
      AND solicitudes.claveEmpresa = '${claveEmpresa}'
 `
}

export const querySolicitudesJustificantesUsuario = (fechaInicio, fechaFin, numero_empleado) => {
  return `
      SELECT
          solicitudes.folio,
          solicitudes.idTipoSolicitud,
          tipoSolicitud.nombreSolicitud,
          solicitudes.numero_empleado,
          solicitudes.claveEmpresa,
          solicitudes.claveSucursal,
          solicitudes.claveDepartamento,
          solicitudes.idMotivo,
          motivos.nombreMotivo,
          solicitudes.descripcionMotivo,
          solicitudes.createdAt,
          solicitudes.updatedAt,
          solicitudDetalle.fechaDiaSolicitado,
          solicitudDetalle.horaDiaSolicitado,
          solicitudDetalle.idEstatusSolicitud,
					usuarios.nombre,
					usuarios.fechaAlta,
					usuarios.aniosLaborados,
					usuarios.diasVacacionesLey,
					usuarios.diasVacacionesRestantes,
					usuarios.diasEconomicosLey,
					usuarios.diasEconomicosRestantes,
					usuarios.puesto,
					usuarios.division,
					usuarios.departamento,
					usuarios.centroTrabajo,
					usuarios.claveSucursal,
					usuarios.numeroEmpleadoJefe,
					usuarios.estatus,
					usuarios.turnoLunesViernes,
					usuarios.turnoSabados,
					aut1.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza1,
					aut1.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza1,
					aut1.fechaAutorizacion AS fechaAutorizacion1,
					aut1.nombreEstatus AS nombreEstatus1,
					aut2.numeroEmpleadoAutoriza AS numeroEmpleadoAutoriza2,
					aut2.nombreEmpleadoAutoriza AS nombreEmpleadoAutoriza2,
					aut2.fechaAutorizacion AS fechaAutorizacion2,
					aut2.nombreEstatus AS nombreEstatus2
      FROM [portal_justificantes_vacaciones].[dbo].[solicitudes] AS solicitudes
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[solicitud_detalle] AS solicitudDetalle ON solicitudes.folio = solicitudDetalle.folio
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_tipo_solicitudes] AS tipoSolicitud ON tipoSolicitud.idTipoSolicitud = solicitudes.idTipoSolicitud
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_motivos] AS motivos ON motivos.idMotivo = solicitudes.idMotivo
			LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = solicitudes.numero_empleado
			LEFT JOIN 
    (SELECT
         a1.idSolicitudDetalle,
         a1.numeroEmpleadoAutoriza,
         a1.nombreEmpleadoAutoriza,
         a1.createdAt AS fechaAutorizacion,
         e1.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a1.idSolicitudDetalle ORDER BY a1.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a1
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e1 ON e1.idEstatusSolicitud = a1.idEstatusAutorizacion
    ) AS aut1 ON aut1.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut1.rn = 1
LEFT JOIN 
    (SELECT
         a2.idSolicitudDetalle,
         a2.numeroEmpleadoAutoriza,
         a2.nombreEmpleadoAutoriza,
         a2.createdAt AS fechaAutorizacion,
         e2.nombreEstatus,
         ROW_NUMBER() OVER (PARTITION BY a2.idSolicitudDetalle ORDER BY a2.createdAt) AS rn
     FROM 
         [portal_justificantes_vacaciones].[dbo].[autorizaciones_solicitudes] AS a2
     LEFT JOIN 
         [portal_justificantes_vacaciones].[dbo].[catalogo_estatus] AS e2 ON e2.idEstatusSolicitud = a2.idEstatusAutorizacion
    ) AS aut2 ON aut2.idSolicitudDetalle = solicitudDetalle.idSolicitudDetalle AND aut2.rn = 2
      WHERE solicitudDetalle.fechaDiaSolicitado BETWEEN '${fechaInicio}' AND '${fechaFin}'
      AND solicitudDetalle.idEstatusSolicitud = 2
      AND solicitudes.numero_empleado = ${numero_empleado}
 `
}

export const queryIncapacidades = (fechaInicio, fechaFin) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      incapacidad.fechaIncapacidad,
      incapacidad.motivo,
      incapacidad.descripcionMotivo,
      incapacidad.editedBy,
      incapacidad.createdAt,
      incapacidad.updatedAt,
      incapacidad.folio
      FROM [portal_justificantes_vacaciones].[dbo].[incapacidades] AS incapacidad
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = incapacidad.numero_empleado 
      AND	incapacidad.fechaIncapacidad BETWEEN '${fechaInicio}' AND '${fechaFin}'
      WHERE usuarios.numero_empleado > 2 AND usuarios.estatus = 1
      ORDER BY usuarios.numero_empleado, incapacidad.fechaIncapacidad ASC
 `
}

export const queryIncapacidadesEmpresa = (fechaInicio, fechaFin, claveEmpresa) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      incapacidad.fechaIncapacidad,
      incapacidad.motivo,
      incapacidad.descripcionMotivo,
      incapacidad.editedBy,
      incapacidad.createdAt,
      incapacidad.updatedAt,
      incapacidad.folio
      FROM [portal_justificantes_vacaciones].[dbo].[incapacidades] AS incapacidad
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = incapacidad.numero_empleado 
      AND	incapacidad.fechaIncapacidad BETWEEN '${fechaInicio}' AND '${fechaFin}'
       WHERE usuarios.numero_empleado > 2 AND usuarios.estatus = 1 AND usuarios.claveEmpresa = '${claveEmpresa}'
      ORDER BY usuarios.numero_empleado, incapacidad.fechaIncapacidad ASC
 `
}

export const queryIncapacidadesUsuario = (fechaInicio, fechaFin, numero_empleado) => {
  return `
      SELECT
      usuarios.numero_empleado,
      usuarios.nombre,
      usuarios.fechaAlta,
      usuarios.aniosLaborados,
      usuarios.diasVacacionesLey,
      usuarios.diasVacacionesRestantes,
      usuarios.diasEconomicosLey,
      usuarios.diasEconomicosRestantes,
      usuarios.puesto,
      usuarios.division,
      usuarios.departamento,
      usuarios.centroTrabajo,
			usuarios.claveEmpresa,
      usuarios.claveSucursal,
			usuarios.claveDepartamento,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      incapacidad.fechaIncapacidad,
      incapacidad.motivo,
      incapacidad.descripcionMotivo,
      incapacidad.editedBy,
      incapacidad.createdAt,
      incapacidad.updatedAt,
      incapacidad.folio
      FROM [portal_justificantes_vacaciones].[dbo].[incapacidades] AS incapacidad
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = incapacidad.numero_empleado 
      AND	incapacidad.fechaIncapacidad BETWEEN '${fechaInicio}' AND '${fechaFin}'
      WHERE usuarios.estatus = 1 AND usuarios.numero_empleado = ${numero_empleado}
      ORDER BY usuarios.numero_empleado, incapacidad.fechaIncapacidad ASC
 `
}

export const queryObtenerEmpleado = (numero_empleado) => {
  return `
  SELECT [idUsuario]
      ,[numero_empleado]
      ,[nombre]
      ,[usuario]
      ,[correo]
      ,[puesto]
      ,[contrasena]
      ,[fechaAlta]
      ,[idPuesto]
      ,[departamento]
      ,[centroTrabajo]
      ,[idDepartamentoSucursal]
      ,[siglasCentroTrabajo]
      ,[numeroEmpleadoJefe]
      ,[fechaNacimiento]
      ,[rfc]
      ,[curp]
      ,[sexo]
      ,[lugarNacimiento]
      ,[estadoCivil]
      ,[direccion]
      ,[codigoPostal]
      ,[ciudad]
      ,[estado]
      ,[telefono]
      ,[division]
      ,[estatus]
      ,[createdAt]
      ,[updatedAt]
      ,[sueldo]
      ,[turnoLunesViernes]
      ,[turnoSabados]
  FROM [portal_sistemas].[dbo].[usuarios] 
  WHERE numero_empleado = ${numero_empleado}
  `
}

export const queryidUsuariosContpaq = (claveEmpresa, baseDatos) => {
  if(claveEmpresa === 'MB'){
    return `
        SELECT idempleado, codigoempleado, '${baseDatos}2020' AS bd
        FROM [${baseDatos}2020].[dbo].nom10001
        UNION
        SELECT idempleado, codigoempleado, '${baseDatos}2024' AS bd
        FROM [${baseDatos}2024].[dbo].nom10001
    `
  }else{
    return `
        SELECT idempleado, codigoempleado, '${baseDatos}' AS bd
        FROM [${baseDatos}].[dbo].nom10001
    `
  }
  
}

export const queryidEventos = (folios) => {
  const conditions = folios.map(folio => `nombre LIKE '%${folio}%'`).join(' OR ')
  return `
      SELECT idEvento, nombre
      FROM [portal_formularios].[dbo].eventoFormularios
      WHERE ${conditions}
  `
}

export const queryGerenteAdministrativo = (claveSucursal) => {
  return `
  SELECT administraSucursal
  FROM [portal_sistemas].[dbo].[sucursales] 
  WHERE abreviacion = '${claveSucursal}'
  `
}

export const querySeguimientoRH = (claveSucursal) => {
  return `
  SELECT seguimientoRH
  FROM [portal_sistemas].[dbo].[sucursales] 
  WHERE abreviacion = '${claveSucursal}'
  `
}

export const queryGratificacionesMecanicos = (objGratificaciones) => {
  const createdAt = new Date().toISOString()
  const updatedAt = new Date().toISOString()
  return `
    INSERT INTO [portal_comisiones].[dbo].[gratificaciones] 
    (idMecanico, tipoGratificacion, monto, fechaGratificacion, claveEmpresa, claveSucursal, usuario, mecanico, sucursal, createdAt, updatedAt)
    VALUES (
      '${objGratificaciones.idMecanico}',
      '${objGratificaciones.tipoGratificacion}',
      ${objGratificaciones.monto},
      '${objGratificaciones.fechaGratificacion}',
      '${objGratificaciones.claveEmpresa}',
      '${objGratificaciones.claveSucursal}',
      '${objGratificaciones.usuario}',
      '${objGratificaciones.mecanico}',
      '${objGratificaciones.sucursal}',
      '${createdAt}', 
      '${updatedAt}'
    );
  `
}

export const queryMecanicos = (numero_empleado) => {
  return `
    SELECT *
    FROM [CAMIONES].[dbo].[mecanicos]
    WHERE no_empleado = '${numero_empleado}';
  `
}