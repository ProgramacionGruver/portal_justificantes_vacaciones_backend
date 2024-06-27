import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'
import Empresas from './Empresas.js'

const Sucursales = db.define('sucursales', {
    idSucursal: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    claveSucursal: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nombreSucursal: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    seguimientoRH: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    seguimientoCopiaRH: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gerenciaAdministrativa: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    claveEmpresa: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    
},
{
    sequelize,
    modelName: "sucursales",
})

Empresas.hasMany(Sucursales, { foreignKey: 'claveEmpresa', sourceKey: 'claveEmpresa'})
Sucursales.belongsTo(Empresas, { foreignKey: 'claveEmpresa', targetKey: 'claveEmpresa'})

export default Sucursales