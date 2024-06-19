import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import Solicitudes from './Solicitudes.js'
import CatalogoEstatus from './CatalogoEstatus.js'

const SolicitudDetalle = db.define('solicitud_detalle', {
    idSolicitudDetalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    folio: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fechaDiaSolicitado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    idEstatusSolicitd: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    {
        sequelize,
        modelName: "solicitud_detalle",
    })

Solicitudes.hasMany(SolicitudDetalle, { foreignKey: 'folio' })
SolicitudDetalle.belongsTo(Solicitudes, { foreignKey: 'folio' })

CatalogoEstatus.hasMany(SolicitudDetalle, { foreignKey: 'idEstatusSolicitd' })
SolicitudDetalle.belongsTo(CatalogoEstatus, { foreignKey: 'idEstatusSolicitd' })

export default SolicitudDetalle