import sequelize from '../config/db.js'
import { DataTypes } from 'sequelize'
import Sucursales from './Sucursales.js'
import Departamentos from './Departamentos.js'
import db from '../config/db.js'

const DepartamentosSucursales = db.define('departamentosSucursales', {
    idDepartamentoSucursal: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    }, 
    claveSucursal:{
        type: DataTypes.STRING, 
        allowNull: false,
    },
    claveDepartamento:{
        type: DataTypes.STRING, 
        allowNull: false,
    },

}, 
{
    sequelize,
    tableName:'departamentosSucursales', 
})

Sucursales.hasMany(DepartamentosSucursales, { foreignKey: 'claveSucursal', sourceKey: 'claveSucursal'})
DepartamentosSucursales.belongsTo(Sucursales, { foreignKey: 'claveSucursal', targetKey: 'claveSucursal'})

Departamentos.hasMany(DepartamentosSucursales, { foreignKey: 'claveDepartamento', sourceKey: 'claveDepartamento'})
DepartamentosSucursales.belongsTo(Departamentos, { foreignKey: 'claveDepartamento', targetKey: 'claveDepartamento'})

export default DepartamentosSucursales