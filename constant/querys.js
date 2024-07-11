export const queryUsuarios = {
    obtenerUsuariosProgramadores: "SELECT numero_empleado FROM [portal_sistemas].[dbo].[usuarios] WHERE (puesto LIKE 'PROGRAMADOR%' OR puesto LIKE 'AUXILIAR DE SISTEMAS') AND estatus = 1",
  }

export const queryChecks = (fechaInicio, fechaFin, claveSucursales) => {
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
      usuarios.siglasCentroTrabajo,
      usuarios.numeroEmpleadoJefe,
      usuarios.estatus,
      usuarios.turnoLunesViernes,
      usuarios.turnoSabados,
      usuarios.createdAt,
      usuarios.updatedAt,
      checks.fechaRegistro,
      checks.horaRegistro
  FROM [portal_justificantes_vacaciones].[dbo].[checksDiarios] AS checks
  JOIN [portal_justificantes_vacaciones].[dbo].[usuarios] AS usuarios ON usuarios.numero_empleado = checks.numero_empleado
  WHERE checks.fechaRegistro BETWEEN '${fechaInicio}' AND '${fechaFin}'
  AND usuarios.siglasCentroTrabajo IN ('EXVE')
  ORDER BY
    usuarios.numero_empleado, checks.fechaRegistro ASC, checks.horaRegistro
 `
}

export const querySolicitudesJustificantes = (fechaInicio, fechaFin, claveSucursales) => {
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
					usuarios.siglasCentroTrabajo,
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
      AND solicitudes.claveSucursal IN ('EXVE')
      AND solicitudDetalle.idEstatusSolicitud = 2
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