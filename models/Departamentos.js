import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const Departamentos = db.define('departamentos', {
    idDepartamento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    claveDepartamento: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nombreDepartamento: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
    
},
{
    sequelize,
    modelName: "departamentos",
})

export default Departamentos