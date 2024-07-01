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
          solicitudDetalle.horaDiaSolicitado
      FROM [portal_justificantes_vacaciones].[dbo].[solicitudes] AS solicitudes
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[solicitud_detalle] AS solicitudDetalle ON solicitudes.folio = solicitudDetalle.folio
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_tipo_solicitudes] AS tipoSolicitud ON tipoSolicitud.idTipoSolicitud = solicitudes.idTipoSolicitud
      LEFT JOIN [portal_justificantes_vacaciones].[dbo].[catalogo_motivos] AS motivos ON motivos.idMotivo = solicitudes.idMotivo
      WHERE solicitudDetalle.fechaDiaSolicitado BETWEEN '${fechaInicio}' AND '${fechaFin}'
      AND solicitudes.claveSucursal IN ('EXVE')
 `
}