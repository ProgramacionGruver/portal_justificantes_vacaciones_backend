import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import db from '../config/db.js'

const Empresas = db.define('empresas', {
    idEmpresa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    claveEmpresa: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    nombreEmpresa: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
    
},
{
    sequelize,
    modelName: "empresas",
})

export default Empresas