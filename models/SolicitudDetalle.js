import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import db from '../config/db.js';
import Solicitudes from './Solicitudes.js';
import CatalogoEstatus from './CatalogoEstatus.js';

const SolicitudDetalle = db.define('solicitud_detalle', {
    idSolicitudDetalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    folio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaDiaSolicitado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    idEstatusSolicitud: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    horaDiaSolicitado: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, 
{
    sequelize,
    modelName: "solicitud_detalle",
    freezeTableName: true
});

Solicitudes.hasMany(SolicitudDetalle, { foreignKey: 'folio', sourceKey: 'folio' });
SolicitudDetalle.belongsTo(Solicitudes, { foreignKey: 'folio', targetKey: 'folio' });

CatalogoEstatus.hasMany(SolicitudDetalle, { foreignKey: 'idEstatusSolicitud' });
SolicitudDetalle.belongsTo(CatalogoEstatus, { foreignKey: 'idEstatusSolicitud' });

export default SolicitudDetalle;
